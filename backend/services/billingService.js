const Pricing = require('../models/pricing');

const findPricingRule = async (vehicleType) => {
    // Pricing now depends only on vehicle type
    return Pricing.findOne({
        vehicleType,
        isActive: true
    });
};

const calculateBill = ({ checkInTime, checkOutTime, hourlyRate, minimumHours = 1 }) => {
    const durationInMs = new Date(checkOutTime) - new Date(checkInTime);
    const durationInMinutes = Math.ceil(durationInMs / (1000 * 60));

    // Minimum charge is 1 hour and then every extra hour is rounded up
    const totalHours = Math.max(minimumHours, Math.ceil(durationInMinutes / 60));
    const totalAmount = totalHours * hourlyRate;

    return {
        durationInMinutes,
        totalHours,
        hourlyRate,
        minimumHours,
        totalAmount
    };
};

module.exports = {
    findPricingRule,
    calculateBill
};
