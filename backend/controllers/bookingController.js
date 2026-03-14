const Booking = require('../models/booking');
const ParkingSlot = require('../models/parkingSlot');
const Pricing = require('../models/pricing');

const getPricingForBooking = async (vehicleType) => {
    // Pricing now depends only on vehicle type
    return Pricing.findOne({
        vehicleType,
        isActive: true
    });
};

const getPopulatedBooking = async (bookingId) => {
    return Booking.findById(bookingId)
        .populate('slotId', 'slotNumber status location slotType')
        .populate('userId', 'name email vehicleNumber');
};

module.exports.createBooking = async (req, res) => {
    try {
        const { slotId, vehicleNumber, vehicleType, expectedCheckInTime } = req.body;
        const selectedVehicleType = vehicleType || 'CAR';

        // One user can have only one active booking
        const activeUserBooking = await Booking.findOne({
            userId: req.user.userId,
            status: { $in: ['BOOKED', 'ACTIVE'] }
        });

        if (activeUserBooking) {
            return res.status(400).json({
                success: false,
                message: 'You already have one active booking'
            });
        }

        const slot = await ParkingSlot.findOne({ _id: slotId, isActive: true });

        if (!slot) {
            return res.status(404).json({
                success: false,
                message: 'Parking slot not found'
            });
        }

        if (slot.status !== 'AVAILABLE') {
            return res.status(400).json({
                success: false,
                message: 'This slot is not available'
            });
        }

        const pricing = await getPricingForBooking(selectedVehicleType);

        // Save booking first
        const booking = await Booking.create({
            userId: req.user.userId,
            slotId,
            vehicleNumber,
            vehicleType: selectedVehicleType,
            expectedCheckInTime,
            hourlyRate: pricing ? pricing.pricePerHour : 0
        });

        // Then mark that slot as booked
        slot.status = 'BOOKED';
        slot.currentBookingId = booking._id;
        await slot.save();

        const populatedBooking = await getPopulatedBooking(booking._id);

        return res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            booking: populatedBooking
        });
    } catch (error) {
        // Unique DB indexes also protect against double booking in race conditions
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Booking could not be created because user or slot already has an active booking'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Unable to create booking'
        });
    }
};

module.exports.getMyBookings = async (req, res) => {
    try {
        // Logged-in user sees only their own booking history
        const bookings = await Booking.find({ userId: req.user.userId })
            .populate('slotId', 'slotNumber status location')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: bookings.length,
            bookings
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Unable to fetch bookings'
        });
    }
};

module.exports.getMyActiveBooking = async (req, res) => {
    try {
        // This helps the user dashboard show the current active booking card
        const booking = await Booking.findOne({
            userId: req.user.userId,
            status: { $in: ['BOOKED', 'ACTIVE'] }
        })
            .populate('slotId', 'slotNumber status location slotType')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            booking
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Unable to fetch active booking'
        });
    }
};

module.exports.cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findOne({
            _id: req.params.id,
            userId: req.user.userId
        });

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // User can cancel only before check-in
        if (booking.status !== 'BOOKED') {
            return res.status(400).json({
                success: false,
                message: 'Only booked slots can be cancelled'
            });
        }

        booking.status = 'CANCELLED';
        await booking.save();

        // Make the slot free again after cancellation
        await ParkingSlot.findByIdAndUpdate(booking.slotId, {
            status: 'AVAILABLE',
            currentBookingId: null
        });

        const updatedBooking = await getPopulatedBooking(booking._id);

        return res.status(200).json({
            success: true,
            message: 'Booking cancelled successfully',
            booking: updatedBooking
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Unable to cancel booking'
        });
    }
};
