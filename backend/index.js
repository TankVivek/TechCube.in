const express = require("express");
const cors = require("cors");
const path = require("path");
const compression = require("compression");
require("dotenv").config();
const fs = require('fs');

// Import routes
const emailRoutes = require("./src/routes/email.routes");

// Import security middleware
const { 
    createRateLimiter, 
    emailRateLimiter, 
    securityHeaders, 
    sanitizeInput 
} = require("./src/middleware/security");

// Import error handling middleware
const { errorHandler, notFound } = require("./src/middleware/errorHandler");

const app = express();

// Security middleware
app.use(securityHeaders);
app.use(compression());

// CORS configuration
const corsOptions = {
    origin: process.env.CORS_ORIGIN 
        ? process.env.CORS_ORIGIN.split(',') 
        : ["http://localhost:3001", "https://techcube.in"],
    methods: ["GET", "POST"],
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Rate limiting
app.use(createRateLimiter());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Input sanitization
app.use(sanitizeInput);

// API Routes with rate limiting
app.use("/api/email", emailRateLimiter, emailRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", message: "Server is running" });
});

// Serve static files from the frontend build directory
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Serve robots.txt
app.get('/robots.txt', (req, res) => {
    const filePath = path.join(__dirname, '../frontend/robots.txt');
    if (fs.existsSync(filePath)) {
        res.type('text/plain');
        res.sendFile(filePath);
    } else {
        res.status(404).send('robots.txt not found');
    }
});

// Serve sitemap.xml
app.get('/sitemap.xml', (req, res) => {
    const filePath = path.join(__dirname, '../frontend/sitemap.xml');
    if (fs.existsSync(filePath)) {
        res.type('application/xml');
        res.sendFile(filePath);
    } else {
        res.status(404).send('sitemap.xml not found');
    }
});


// Catch-all: serve React app for all other routes
app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) return res.status(404).json({ success: false, error: 'Endpoint not found' });
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Redirect /index.php and any path starting with /index.php to /
app.get(/^\/index\.php(\/.*)?$/, (req, res) => {
    res.redirect(301, '/');
});

// Serve /index.php as the React app homepage
app.get('/index.php', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

const PORT = process.env.PORT || 3000;

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
