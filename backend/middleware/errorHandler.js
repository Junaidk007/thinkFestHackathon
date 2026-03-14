
const errorHandler = (err, req, res, next) => {
    // Log full error for easier debugging
    console.error('💥 Internal Server Error:', err);

    const statusCode = err.statusCode || 500;

    const response = {
        message: err.message || 'Internal Server Error',
        success: false
    };

    // Include stack trace only in development
    if (process.env.NODE_ENV === 'development') {
        response.stack = err.stack;
    }

    res.status(statusCode).json(response);
};

module.exports = errorHandler;
