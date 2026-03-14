const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const generateBookingId = () => {
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    // Example: BK-20260313-4821
    return `BK-${year}${month}${day}-${randomPart}`;
};

const bookingSchema = new Schema({
    // Human-friendly booking id for UI display
    bookingId: {
        type: String,
        unique: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    slotId: {
        type: Schema.Types.ObjectId,
        ref: 'ParkingSlot',
        required: true
    },
    vehicleNumber: {
        type: String,
        required: true,
        trim: true,
        uppercase: true
    },
    vehicleType: {
        type: String,
        enum: ['BIKE', 'CAR', 'SUV', 'EV', 'OTHER'],
        default: 'CAR'
    },
    bookingTime: {
        type: Date,
        default: Date.now
    },
    expectedCheckInTime: {
        type: Date
    },
    checkInTime: {
        type: Date,
        default: null
    },
    checkOutTime: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: ['BOOKED', 'ACTIVE', 'COMPLETED', 'CANCELLED'],
        default: 'BOOKED'
    },
    hourlyRate: {
        type: Number,
        min: 0,
        default: 0
    },
    totalAmount: {
        type: Number,
        min: 0,
        default: 0
    },
    checkedInBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    checkedOutBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }
}, {
    timestamps: true
});

bookingSchema.pre('validate', function () {
    // Create bookingId automatically when a new booking is saved
    if (!this.bookingId) {
        this.bookingId = generateBookingId();
    }
});

bookingSchema.index(
    { userId: 1 },
    {
        unique: true,
        partialFilterExpression: {
            status: { $in: ['BOOKED', 'ACTIVE'] }
        }
    }
);

bookingSchema.index(
    { slotId: 1 },
    {
        unique: true,
        partialFilterExpression: {
            status: { $in: ['BOOKED', 'ACTIVE'] }
        }
    }
);

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
