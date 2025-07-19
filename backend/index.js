const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const fs = require('fs');

// Import routes
const emailRoutes = require("./src/routes/email.routes");

const app = express();

// Middleware
app.use(
    cors({
        origin:
            process.env.CORS_ORIGIN ||
            "http://localhost:3000" ||
            "https://techcube.in" ||
            "*",
        methods: ["GET", "POST"],
        credentials: true,
    }),
);
app.use(express.json());

// API Routes
app.use("/api/email", emailRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", message: "Server is running" });
});

// Serve static files from the frontend build directory
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Serve robots.txt as plain text
app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.sendFile(path.join(__dirname, '../frontend/robots.txt'));
});

// Serve sitemap.xml as application/xml
app.get('/sitemap.xml', (req, res) => {
    res.type('application/xml');
    res.sendFile(path.join(__dirname, '../frontend/sitemap.xml'));
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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
