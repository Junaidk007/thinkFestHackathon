const router = require('express').Router();
const { userVerification } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');
const bookingController = require('../controllers/bookingController');
const {
    createBookingValidation,
    cancelBookingParamValidation
} = require('../middleware/parkingValidation');

// USER creates a new parking booking
router.post(
    '/',
    userVerification,
    allowRoles('USER'),
    createBookingValidation,
    bookingController.createBooking
);

// USER sees only their own bookings
router.get('/my', userVerification, allowRoles('USER'), bookingController.getMyBookings);

// USER sees current active booking for dashboard card
router.get('/active', userVerification, allowRoles('USER'), bookingController.getMyActiveBooking);

// USER can cancel only before check-in
router.patch(
    '/:id/cancel',
    userVerification,
    allowRoles('USER'),
    cancelBookingParamValidation,
    bookingController.cancelBooking
);

module.exports = router;
