const User = require('../models/user');
const {createSecretToken} = require('../utils/secretToken.js');

const buildErrorPayload = (error) => {
    if (process.env.NODE_ENV === 'development') {
        return {
            message: error.message || 'Internal server error',
            success: false,
            stack: error.stack
        };
    }

    return {
        message: 'Internal server error',
        success: false
    };
};

const ensureJwtSecret = () => {
    if (!process.env.TOKEN_KEY) {
        const error = new Error('TOKEN_KEY is missing. Check backend/.env');
        error.statusCode = 500;
        throw error;
    }
};
 
const buildAuthResponse = (user, jwtToken) => ({
    // Keep response format same for signup and login
    message: 'Authentication successful',
    success: true,
    jwtToken,
    user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        vehicleNumber: user.vehicleNumber,
        department: user.department,
        profilePicture: user.profilePicture
    }
});

module.exports.signupControl = async (req,res) => {

    try {
        const {name, email, password, vehicleNumber, department, role} = req.body;
        const existingUser = await User.findOne({email});
        
        if (existingUser) {
            return res.status(409).json({message: 'User already exists', success: false});
        }

        const user = new User({
            name,
            email,
            password,
            // Public registration creates only normal USER accounts
            role: role || 'USER',
            vehicleNumber,
            department
        });
        await user.save();
        ensureJwtSecret();
        const jwtToken = createSecretToken(user);

        res.status(201)
           .json({
                ...buildAuthResponse(user, jwtToken),
                message: 'User signed up successfully'
           });

    } catch (error) {
        console.error('signupControl error:', error.message);
        if (error.stack) {
            console.error(error.stack);
        }
        res.status(500)
           .json(buildErrorPayload(error));
    }
};

module.exports.loginControl = async (req,res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});

        if (!user || !user.password) {
            return res.status(403)
            .json({message: 'Incorrect password or email', success: false});
        }

        // if (!user.isActive) {
        //     return res.status(403)
        //     .json({message: 'Account is inactive', success: false});
        // }

        // Password compare method comes from user model
        const isPassEqual = await user.comparePassword(password);

        if (!isPassEqual) {
            return res.status(403)
            .json({message: 'Incorrect password or email', success: false});
        }

        ensureJwtSecret();
        const jwtToken = createSecretToken(user);

        res.status(200)
           .json({
                ...buildAuthResponse(user, jwtToken),
                message: 'User logged in successfully'
            });
    } catch (error) {
        console.error('loginControl error:', error.message);
        if (error.stack) {
            console.error(error.stack);
        }
        res.status(500)
           .json(buildErrorPayload(error));
    }
};

module.exports.getCurrentUser = async (req, res) => {
    try {
        // req.user comes from verified JWT
        const user = await User.findById(req.user.userId).select('-password');

        if (!user) {
            return res.status(404).json({message: 'User not found', success: false});
        }

        return res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error('getCurrentUser error:', error.message);
        if (error.stack) {
            console.error(error.stack);
        }
        return res.status(500).json(buildErrorPayload(error));
    }
};
