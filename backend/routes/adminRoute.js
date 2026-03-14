const router = require('express').Router();
const { userVerification } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');
const adminController = require('../controllers/adminController');
const {
    createSlotValidation,
    slotIdParamValidation,
    setPricingValidation,
    revenueQueryValidation,
    createStaffValidation
} = require('../middleware/parkingValidation');

// ADMIN dashboard summary
router.get('/overview', userVerification, allowRoles('ADMIN'), adminController.getOverview);

// ADMIN can see all active slots
router.get('/slots', userVerification, allowRoles('ADMIN'), adminController.getAllSlots);

// ADMIN can see all bookings in the system
router.get('/bookings', userVerification, allowRoles('ADMIN'), adminController.getAllBookings);

// ADMIN can view revenue report with optional date filter
router.get(
    '/revenue',
    userVerification,
    allowRoles('ADMIN'),
    revenueQueryValidation,
    adminController.getRevenueReport
);

// ADMIN creates a parking slot
router.post(
    '/slots',
    userVerification,
    allowRoles('ADMIN'),
    createSlotValidation,
    adminController.createSlot
);

// ADMIN deletes only available slots
router.delete(
    '/slots/:slotId',
    userVerification,
    allowRoles('ADMIN'),
    slotIdParamValidation,
    adminController.deleteSlot
);

// ADMIN sets hourly pricing
router.patch(
    '/pricing',
    userVerification,
    allowRoles('ADMIN'),
    setPricingValidation,
    adminController.setPricing
);

// ADMIN can list all staff accounts
router.get('/staff', userVerification, allowRoles('ADMIN'), adminController.getStaffList);

// ADMIN can create staff accounts
router.post(
    '/staff',
    userVerification,
    allowRoles('ADMIN'),
    createStaffValidation,
    adminController.createStaff
);

module.exports = router;
