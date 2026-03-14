const Joi = require('joi');
const mongoose = require('mongoose');

const validateRequest = (schema, property = 'body') => {
    return (req, res, next) => {
        // Validate req.body, req.params, or req.query based on route need
        const { error } = schema.validate(req[property]);

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        next();
    };
};

const objectIdRule = Joi.string().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error('any.invalid');
    }

    return value;
}, 'ObjectId validation');

const createBookingValidation = validateRequest(Joi.object({
    slotId: objectIdRule.required(),
    vehicleNumber: Joi.string().trim().max(20).required(),
    vehicleType: Joi.string().valid('BIKE', 'CAR', 'SUV', 'EV', 'OTHER').optional(),
    expectedCheckInTime: Joi.date().optional()
}));

const bookingIdParamValidation = validateRequest(Joi.object({
    bookingId: objectIdRule.required()
}), 'params');

const cancelBookingParamValidation = validateRequest(Joi.object({
    id: objectIdRule.required()
}), 'params');

const createSlotValidation = validateRequest(Joi.object({
    slotNumber: Joi.string().trim().max(20).required(),
    slotType: Joi.string().valid('STUDENT', 'TEACHER', 'GENERAL').optional(),
    location: Joi.string().trim().max(100).optional().allow(''),
    rowLabel: Joi.string().trim().max(10).optional().allow(''),
    columnNumber: Joi.number().integer().min(1).optional()
}));

const slotIdParamValidation = validateRequest(Joi.object({
    slotId: objectIdRule.required()
}), 'params');

const setPricingValidation = validateRequest(Joi.object({
    vehicleType: Joi.string().valid('BIKE', 'CAR', 'SUV', 'EV', 'OTHER').required(),
    pricePerHour: Joi.number().min(0).required(),
    minimumHours: Joi.number().integer().min(1).optional()
}));

const slotQueryValidation = validateRequest(Joi.object({
    status: Joi.string().valid('AVAILABLE', 'BOOKED', 'OCCUPIED').optional()
}), 'query');

const revenueQueryValidation = validateRequest(Joi.object({
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().optional()
}), 'query');

const createStaffValidation = validateRequest(Joi.object({
    name: Joi.string().trim().min(3).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(100).required(),
    department: Joi.string().trim().max(100).optional().allow(''),
    vehicleNumber: Joi.string().trim().max(20).optional().allow('')
}));

module.exports = {
    createBookingValidation,
    bookingIdParamValidation,
    cancelBookingParamValidation,
    createSlotValidation,
    slotIdParamValidation,
    setPricingValidation,
    slotQueryValidation,
    revenueQueryValidation,
    createStaffValidation
};
