const express = require("express");
const cors = require("cors");
const path = require("path");
const compression = require("compression");
const http = require("http");
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

// Import support service
const support = require("./src/services/support.service");

const app = express();
const server = http.createServer(app);

// Trust proxy for rate limiting behind reverse proxies (like Render)
app.set('trust proxy', 1);

// Health check endpoint (defined early to bypass security/rate limit middleware)
app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", message: "Server is running" });
});

// Socket.io setup
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: process.env.CORS_ORIGIN 
            ? process.env.CORS_ORIGIN.split(',') 
            : ["http://localhost:3001", "https://techcube.in", "https://www.techcube.in"],
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Track active admin sockets
const adminSockets = new Set();

// Security middleware
app.use(securityHeaders);
app.use(compression());

// CORS configuration
const corsOptions = {
    origin: process.env.CORS_ORIGIN 
        ? process.env.CORS_ORIGIN.split(',') 
        : ["http://localhost:3001", "https://techcube.in", "https://www.techcube.in"],
    methods: ["GET", "POST"],
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Health check endpoint (Top-level for reliability)
app.get("/health", (req, res) => {
    res.status(200).json({ 
        status: "OK", 
        message: "Server is running",
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV || 'development'
    });
});

// Rate limiting
app.use(createRateLimiter());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Input sanitization
app.use(sanitizeInput);

// API Routes with rate limiting
app.use("/api/email", emailRateLimiter, emailRoutes);

// ── Support Chat API (inline, minimal) ──────────────────────────────
const ADMIN_PASS = process.env.SUPPORT_ADMIN_PASSWORD || 'Admin@TechCube123';

// Start a support session
app.post("/api/support/initiate", (req, res) => {
    try {
        const { name, email } = req.body;
        if (!name || !email) return res.status(400).json({ success: false, message: "Name and email required" });
        const ticket = support.createTicket(name, email);
        const agentOnline = adminSockets.size > 0;
        if (!agentOnline) {
            support.addMessage(ticket.id, 'system', 'No agent is currently online. Your message has been saved as a support ticket. We will get back to you soon!');
        }
        res.json({ success: true, ticket: { id: ticket.id, status: ticket.status }, agentOnline });
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
});

// Get ticket (for user to restore session)
app.get("/api/support/ticket/:id", (req, res) => {
    const ticket = support.loadTicket(req.params.id);
    if (!ticket) return res.status(404).json({ success: false, message: "Ticket not found" });
    res.json({ success: true, ticket });
});

// Admin: list all tickets
app.get("/api/support/tickets", (req, res) => {
    const pass = req.headers['x-admin-password'];
    if (pass !== ADMIN_PASS) return res.status(401).json({ success: false, message: "Unauthorized" });
    res.json({ success: true, tickets: support.listTickets() });
});

// Admin: close/resolve ticket
app.post("/api/support/ticket/:id/close", (req, res) => {
    const pass = req.headers['x-admin-password'];
    if (pass !== ADMIN_PASS) return res.status(401).json({ success: false, message: "Unauthorized" });
    const ticket = support.updateStatus(req.params.id, 'closed');
    if (!ticket) return res.status(404).json({ success: false, message: "Ticket not found" });
    io.to(`ticket_${req.params.id}`).emit('ticket_closed');
    res.json({ success: true });
});

// ── Socket.io Events ────────────────────────────────────────────────
io.on("connection", (socket) => {

    // User joins their ticket room
    socket.on("join_ticket", (ticketId) => {
        socket.join(`ticket_${ticketId}`);
        socket.ticketId = ticketId;
    });

    // Admin joins
    socket.on("admin_join", (password) => {
        if (password !== ADMIN_PASS) return socket.emit("auth_error", "Wrong password");
        socket.isAdmin = true;
        adminSockets.add(socket.id);
        socket.join("admin_room");
        socket.emit("admin_authenticated");
    });

    // Admin joins a specific ticket chat
    socket.on("admin_join_ticket", (ticketId) => {
        if (!socket.isAdmin) return;
        socket.join(`ticket_${ticketId}`);
        support.setAgentFlag(ticketId, true);
        io.to(`ticket_${ticketId}`).emit('agent_joined');
    });

    // User sends a message
    socket.on("user_message", ({ ticketId, text }) => {
        const msg = support.addMessage(ticketId, 'user', text);
        if (msg) {
            io.to(`ticket_${ticketId}`).emit('new_message', msg);
            // Notify admin room about new message
            io.to("admin_room").emit('ticket_update', { ticketId, msg });
        }
    });

    // Admin sends a reply
    socket.on("admin_message", ({ ticketId, text }) => {
        if (!socket.isAdmin) return;
        const msg = support.addMessage(ticketId, 'agent', text);
        if (msg) {
            io.to(`ticket_${ticketId}`).emit('new_message', msg);
            io.to("admin_room").emit('ticket_update', { ticketId, msg });
        }
    });

    socket.on("disconnect", () => {
        if (socket.isAdmin) adminSockets.delete(socket.id);
    });
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

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
