const router = require('express').Router();
const authControler = require('../controllers/authController.js')
const {userVerification} = require('../middleware/authMiddleware.js')
const {signupValidation, loginValidation} = require('../middleware/authValidation.js')

router.post('/signup', signupValidation, authControler.signupControl)
router.post('/register', signupValidation, authControler.signupControl)
router.post('/login', loginValidation, authControler.loginControl)
router.get('/me', userVerification, authControler.getCurrentUser)

module.exports = router;
