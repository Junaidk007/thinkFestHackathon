const jwt = require('jsonwebtoken');

module.exports.userVerification = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(403).json({message: 'Unauthorized, JWT token is required'});
    }

    try {
        const token = authHeader.startsWith('Bearer ')
            ? authHeader.slice(7).trim()
            : authHeader.trim();

        if (!token) {
            return res.status(403).json({message: 'Unauthorized, JWT token is required'});
        }

        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({message: 'Unauthorized, JWT token is wrong or expired'});
    }
};
