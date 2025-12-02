const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const apiRoutes = require('./routes/api');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins for dev
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Make io accessible in routes
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Routes
app.use('/api', apiRoutes);

// Socket.io connection handler
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join_tenant', (tenantId) => {
        socket.join(tenantId);
        console.log(`User ${socket.id} joined tenant ${tenantId}`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'Xeno Shopify Ingestion Service',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

app.get('/health', (req, res) => {
    res.json({ status: 'OK', uptime: process.uptime() });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// Start server (not in production/Vercel)
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    server.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📊 Dashboard API: http://localhost:${PORT}/api/dashboard/demo_tenant`);
        console.log(`💚 Health check: http://localhost:${PORT}/health`);
        console.log(`🔌 Socket.io ready`);
    });
}

module.exports = app;
