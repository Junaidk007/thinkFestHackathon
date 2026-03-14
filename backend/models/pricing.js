const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pricingSchema = new Schema({
    vehicleType: {
        type: String,
        enum: ['BIKE', 'CAR', 'SUV', 'EV', 'OTHER'],
        required: true
    },
    pricePerHour: {
        type: Number,
        required: true,
        min: 0
    },
    minimumHours: {
        type: Number,
        default: 1,
        min: 1
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

pricingSchema.index({ vehicleType: 1 }, { unique: true });

const Pricing = mongoose.model('Pricing', pricingSchema);

module.exports = Pricing;
