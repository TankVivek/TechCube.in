// Error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Default error
    let error = {
        success: false,
        message: 'Internal Server Error',
        statusCode: 500
    };

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        error.message = Object.values(err.errors).map(val => val.message).join(', ');
        error.statusCode = 400;
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        error.message = 'Duplicate field value entered';
        error.statusCode = 400;
    }

    // Mongoose cast error
    if (err.name === 'CastError') {
        error.message = 'Resource not found';
        error.statusCode = 404;
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        error.message = 'Invalid token';
        error.statusCode = 401;
    }

    if (err.name === 'TokenExpiredError') {
        error.message = 'Token expired';
        error.statusCode = 401;
    }

    // Custom error
    if (err.statusCode) {
        error.statusCode = err.statusCode;
        error.message = err.message;
    }

    // Development error response
    if (process.env.NODE_ENV === 'development') {
        error.stack = err.stack;
    }

    res.status(error.statusCode).json(error);
};

// 404 handler
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
};

module.exports = {
    errorHandler,
    notFound
}; 