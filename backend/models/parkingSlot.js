const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const parkingSlotSchema = new Schema({
    slotNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        uppercase: true
    },
    slotType: {
        type: String,
        enum: ['STUDENT', 'TEACHER', 'GENERAL'],
        default: 'GENERAL'
    },
    status: {
        type: String,
        enum: ['AVAILABLE', 'BOOKED', 'OCCUPIED'],
        default: 'AVAILABLE'
    },
    location: {
        type: String,
        trim: true
    },
    rowLabel: {
        type: String,
        trim: true,
        uppercase: true
    },
    columnNumber: {
        type: Number,
        min: 1
    },
    currentBookingId: {
        type: Schema.Types.ObjectId,
        ref: 'Booking',
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const ParkingSlot = mongoose.model('ParkingSlot', parkingSlotSchema);

module.exports = ParkingSlot;
