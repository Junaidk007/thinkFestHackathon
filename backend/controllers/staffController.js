const Booking = require('../models/booking');
const ParkingSlot = require('../models/parkingSlot');
const { findPricingRule, calculateBill } = require('../services/billingService');

module.exports.getStaffDashboard = async (req, res) => {
    try {
        // These numbers are useful for staff dashboard cards
        const bookedCount = await Booking.countDocuments({ status: 'BOOKED' });
        const activeCount = await Booking.countDocuments({ status: 'ACTIVE' });
        const occupiedSlots = await ParkingSlot.countDocuments({ status: 'OCCUPIED', isActive: true });

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const completedToday = await Booking.countDocuments({
            status: 'COMPLETED',
            checkOutTime: { $gte: todayStart }
        });

        return res.status(200).json({
            success: true,
            dashboard: {
                bookedCount,
                activeCount,
                occupiedSlots,
                completedToday
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Unable to load staff dashboard'
        });
    }
};

module.exports.getActiveBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ status: { $in: ['BOOKED', 'ACTIVE'] } })
            .populate('userId', 'name email role vehicleNumber')
            .populate('slotId', 'slotNumber status location slotType')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: bookings.length,
            bookings
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Unable to fetch active bookings'
        });
    }
};

module.exports.checkInBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.bookingId)
            .populate('userId', 'name email role vehicleNumber')
            .populate('slotId', 'slotNumber status location slotType');

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        if (booking.status !== 'BOOKED') {
            return res.status(400).json({
                success: false,
                message: 'Only booked entries can be checked in'
            });
        }

        // Booking becomes active when car actually enters parking
        booking.status = 'ACTIVE';
        booking.checkInTime = new Date();
        booking.checkedInBy = req.user.userId;
        await booking.save();

        // Slot also becomes occupied
        await ParkingSlot.findByIdAndUpdate(booking.slotId, {
            status: 'OCCUPIED',
            currentBookingId: booking._id
        });

        return res.status(200).json({
            success: true,
            message: 'Check-in completed successfully',
            booking
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Unable to complete check-in'
        });
    }
};

module.exports.checkOutBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.bookingId)
            .populate('userId', 'name email role vehicleNumber')
            .populate('slotId', 'slotNumber status location slotType');

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        if (booking.status !== 'ACTIVE') {
            return res.status(400).json({
                success: false,
                message: 'Only active bookings can be checked out'
            });
        }

        const checkOutTime = new Date();
        const pricingRule = await findPricingRule(booking.vehicleType);
        const minimumHours = pricingRule ? pricingRule.minimumHours : 1;
        const billDetails = calculateBill({
            checkInTime: booking.checkInTime,
            checkOutTime,
            hourlyRate: booking.hourlyRate,
            minimumHours
        });

        // Save checkout time and final bill
        booking.status = 'COMPLETED';
        booking.checkOutTime = checkOutTime;
        booking.checkedOutBy = req.user.userId;
        booking.totalAmount = billDetails.totalAmount;
        await booking.save();

        // Free the slot after checkout
        await ParkingSlot.findByIdAndUpdate(booking.slotId, {
            status: 'AVAILABLE',
            currentBookingId: null
        });

        const updatedBooking = await Booking.findById(booking._id)
            .populate('userId', 'name email role vehicleNumber')
            .populate('slotId', 'slotNumber status location slotType');

        return res.status(200).json({
            success: true,
            message: 'Check-out completed successfully',
            bill: billDetails,
            booking: updatedBooking
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Unable to complete check-out'
        });
    }
};
