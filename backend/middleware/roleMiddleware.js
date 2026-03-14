module.exports.allowRoles = (...allowedRoles) => {
    return (req, res, next) => {
        // authMiddleware must run before this middleware
        // because req.user comes from the verified JWT
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User information not found'
            });
        }

        // Check whether logged-in user's role is allowed
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied for this role'
            });
        }

        // If role matches, allow request to continue
        next();
    };
};
