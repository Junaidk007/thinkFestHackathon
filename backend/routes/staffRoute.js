const router = require('express').Router();
const { userVerification } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');
const staffController = require('../controllers/staffController');
const { bookingIdParamValidation } = require('../middleware/parkingValidation');

// STAFF dashboard summary cards
router.get('/dashboard', userVerification, allowRoles('STAFF'), staffController.getStaffDashboard);

// STAFF sees all active and booked entries
router.get('/bookings', userVerification, allowRoles('STAFF'), staffController.getActiveBookings);

// STAFF marks a booked slot as checked in
router.patch(
    '/check-in/:bookingId',
    userVerification,
    allowRoles('STAFF'),
    bookingIdParamValidation,
    staffController.checkInBooking
);

// STAFF completes check-out and bill generation
router.patch(
    '/check-out/:bookingId',
    userVerification,
    allowRoles('STAFF'),
    bookingIdParamValidation,
    staffController.checkOutBooking
);

module.exports = router;
