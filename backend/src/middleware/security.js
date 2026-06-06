const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// Rate limiting middleware
const createRateLimiter = (windowMs = 15 * 60 * 1000, max = 100) => {
    return rateLimit({
        windowMs,
        max,
        message: {
            success: false,
            message: 'Too many requests from this IP, please try again later.'
        },
        standardHeaders: true,
        legacyHeaders: false,
    });
};

// Specific rate limiter for email endpoints
const emailRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 email requests per windowMs
    message: {
        success: false,
        message: 'Too many email requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Security headers middleware
const securityHeaders = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:", "https://www.google.com", "https://www.google-analytics.com", "https://www.googletagmanager.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://www.googletagmanager.com", "https://www.google.com", "https://www.gstatic.com", "https://www.google-analytics.com"],
            connectSrc: [
                "'self'", 
                "https://techcube.in", 
                "wss://techcube.in", 
                "https://www.techcube.in",
                "wss://www.techcube.in",
                "ws://techcube.in", 
                "ws://www.techcube.in", 
                "https://techcube-in.onrender.com",
                "wss://techcube-in.onrender.com",
                "https://www.techcube-in.onrender.com",
                "wss://www.techcube-in.onrender.com",
                "ws://techcube-in.onrender.com",
                "ws://www.techcube-in.onrender.com",
                "ws://localhost:*", 
                "wss://localhost:*", 
                "http://localhost:*",
                "https://www.google.com",
                "https://www.google-analytics.com",
                "https://*.google-analytics.com",
                "https://*.analytics.google.com",
                "https://*.googletagmanager.com",
                "https://*.g.doubleclick.net",
                "https://*.google.com"
            ],
            frameSrc: ["'self'", "https://www.google.com"],
        },
    },
    crossOriginEmbedderPolicy: false,
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    }
});

// Input sanitization middleware
const sanitizeInput = (req, res, next) => {
    if (req.body) {
        Object.keys(req.body).forEach(key => {
            if (typeof req.body[key] === 'string') {
                req.body[key] = req.body[key].trim();
            }
        });
    }
    next();
};

module.exports = {
    createRateLimiter,
    emailRateLimiter,
    securityHeaders,
    sanitizeInput
}; 