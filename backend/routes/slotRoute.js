const router = require('express').Router();
const { userVerification } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');
const slotController = require('../controllers/slotController');
const { slotQueryValidation } = require('../middleware/parkingValidation');

// All logged-in roles can view slots for their dashboard
router.get(
    '/',
    userVerification,
    allowRoles('ADMIN', 'STAFF', 'USER'),
    slotQueryValidation,
    slotController.getAllSlots
);

module.exports = router;
