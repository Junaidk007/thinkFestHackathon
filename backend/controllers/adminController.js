const Booking = require('../models/booking');
const ParkingSlot = require('../models/parkingSlot');
const Pricing = require('../models/pricing');
const User = require('../models/user');

const buildRevenueSummary = (bookings) => {
    // Convert completed bookings into small admin-friendly totals
    const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
    const totalCompletedBookings = bookings.length;

    return {
        totalRevenue,
        totalCompletedBookings
    };
};

module.exports.getOverview = async (req, res) => {
    try {
        // Count slot status for admin dashboard cards
        const totalSlots = await ParkingSlot.countDocuments({ isActive: true });
        const availableSlots = await ParkingSlot.countDocuments({ isActive: true, status: 'AVAILABLE' });
        const bookedSlots = await ParkingSlot.countDocuments({ isActive: true, status: 'BOOKED' });
        const occupiedSlots = await ParkingSlot.countDocuments({ isActive: true, status: 'OCCUPIED' });
        const completedBookings = await Booking.find({ status: 'COMPLETED' }).select('totalAmount');
        const pricingList = await Pricing.find({ isActive: true }).sort({ createdAt: -1 });
        const slotList = await ParkingSlot.find({ isActive: true }).sort({ slotNumber: 1 });

        // Add all completed booking amounts to get total revenue
        const revenueSummary = buildRevenueSummary(completedBookings);

        return res.status(200).json({
            success: true,
            overview: {
                totalSlots,
                availableSlots,
                bookedSlots,
                occupiedSlots,
                totalRevenue: revenueSummary.totalRevenue,
                totalCompletedBookings: revenueSummary.totalCompletedBookings,
                pricing: pricingList,
                recentSlots: slotList.slice(0, 10)
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Unable to load admin overview'
        });
    }
};

module.exports.getAllSlots = async (req, res) => {
    try {
        // Admin can see all active slots with their current state
        const slots = await ParkingSlot.find({ isActive: true }).sort({ slotNumber: 1 });

        return res.status(200).json({
            success: true,
            count: slots.length,
            slots
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Unable to fetch parking slots'
        });
    }
};

module.exports.getAllBookings = async (req, res) => {
    try {
        // Admin can see every booking in the system
        const bookings = await Booking.find()
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
            message: 'Unable to fetch all bookings'
        });
    }
};

module.exports.getRevenueReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const query = { status: 'COMPLETED' };

        // Admin can filter revenue by checkout date
        if (startDate || endDate) {
            query.checkOutTime = {};

            if (startDate) {
                query.checkOutTime.$gte = new Date(startDate);
            }

            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                query.checkOutTime.$lte = end;
            }
        }

        const bookings = await Booking.find(query)
            .populate('userId', 'name email')
            .populate('slotId', 'slotNumber')
            .sort({ checkOutTime: -1 });

        const summary = buildRevenueSummary(bookings);

        return res.status(200).json({
            success: true,
            summary,
            bookings
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Unable to fetch revenue report'
        });
    }
};

module.exports.createSlot = async (req, res) => {
    try {
        const { slotNumber, slotType, location, rowLabel, columnNumber } = req.body;

        const existingSlot = await ParkingSlot.findOne({ slotNumber: slotNumber.toUpperCase() });

        if (existingSlot) {
            return res.status(409).json({
                success: false,
                message: 'Slot number already exists'
            });
        }

        const slot = await ParkingSlot.create({
            slotNumber,
            slotType,
            location,
            rowLabel,
            columnNumber
        });

        return res.status(201).json({
            success: true,
            message: 'Parking slot added successfully',
            slot
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'Slot number already exists'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Unable to add parking slot'
        });
    }
};

module.exports.deleteSlot = async (req, res) => {
    try {
        const slot = await ParkingSlot.findById(req.params.slotId);

        if (!slot) {
            return res.status(404).json({
                success: false,
                message: 'Parking slot not found'
            });
        }

        if (slot.status !== 'AVAILABLE') {
            return res.status(400).json({
                success: false,
                message: 'Only available slots can be deleted'
            });
        }

        // Soft delete keeps history safe in DB
        slot.isActive = false;
        await slot.save();

        return res.status(200).json({
            success: true,
            message: 'Parking slot deleted successfully'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Unable to delete parking slot'
        });
    }
};

module.exports.setPricing = async (req, res) => {
    try {
        const { vehicleType, pricePerHour, minimumHours } = req.body;

        // If pricing exists for this vehicle type, update it. Otherwise create it.
        const pricing = await Pricing.findOneAndUpdate(
            {
                vehicleType
            },
            {
                vehicleType,
                pricePerHour,
                minimumHours: minimumHours || 1,
                isActive: true
            },
            {
                new: true,
                upsert: true
            }
        );

        return res.status(200).json({
            success: true,
            message: 'Pricing saved successfully',
            pricing
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'Pricing already exists for this vehicle type'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Unable to save pricing'
        });
    }
};

module.exports.getStaffList = async (req, res) => {
    try {
        const staff = await User.find({ role: 'STAFF' })
            .select('name email department vehicleNumber role isActive createdAt')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: staff.length,
            staff
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Unable to fetch staff list'
        });
    }
};

module.exports.createStaff = async (req, res) => {
    try {
        const { name, email, password, department, vehicleNumber } = req.body;

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(409).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        const staff = await User.create({
            name,
            email,
            password,
            department,
            vehicleNumber,
            role: 'STAFF'
        });

        return res.status(201).json({
            success: true,
            message: 'Staff account created successfully',
            staff: {
                id: staff._id,
                name: staff.name,
                email: staff.email,
                role: staff.role,
                department: staff.department,
                vehicleNumber: staff.vehicleNumber,
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Unable to create staff account'
        });
    }
};
