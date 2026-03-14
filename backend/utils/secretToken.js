const jwt = require('jsonwebtoken');

module.exports.createSecretToken = (user) => {
    return jwt.sign({
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    }, process.env.TOKEN_KEY, {
        expiresIn: "3d"
    });
};
