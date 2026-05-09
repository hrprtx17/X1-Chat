// Load environment variables FIRST
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Global error handlers to prevent silent crashes
process.on('uncaughtException', (err) => {
  console.error('❌ UNCAUGHT EXCEPTION:', err);
  console.error('Stack:', err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ UNHANDLED REJECTION at:', promise, 'reason:', reason);
});

// Load routes
const authRoutes = require('./routes/auth');
const ticketRoutes = require('./routes/tickets');
const faqRoutes = require('./routes/faqs');
const chatRoutes = require('./routes/chatbot');

const app = express();

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  /\.vercel\.app$/, // Standard Vercel subdomains
  /--.*\.vercel\.app$/, // Vercel preview deployments
  process.env.FRONTEND_URL, // Explicitly allowed production domain
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    
    const isAllowed = allowedOrigins.some(pattern => {
      if (pattern instanceof RegExp) return pattern.test(origin);
      return pattern === origin;
    });

    if (isAllowed || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      console.warn(`⚠️ CORS blocked for origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Cookie'],
  exposedHeaders: ['Set-Cookie']
}));

app.use(cookieParser());
app.use(express.json());

// Request logging for debugging production
app.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    if (req.method !== 'GET') {
      // Be careful not to log sensitive data in real production, but helpful for debugging now
      console.log('Body keys:', Object.keys(req.body));
    }
  }
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/chat', chatRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'X1Chat API Running!',
    version: '1.1.0',
    status: 'healthy',
    environment: process.env.NODE_ENV || 'development'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Express error middleware (must be last)
app.use((err, req, res, next) => {
  if (err.name === 'Error' && err.message === 'Not allowed by CORS') {
    return res.status(403).json({ message: 'CORS policy block' });
  }
  
  console.error('🔴 Express Error:', err.message);
  res.status(err.status || 500).json({ 
    message: 'Server error',
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

// Configuration validation and startup
const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGO_URI;

// Validate required environment variables
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(v => !process.env[v]);

if (missingEnvVars.length > 0) {
  console.error(`❌ STARTUP FAILED: Missing environment variables: ${missingEnvVars.join(', ')}`);
  process.exit(1);
}

// Connect to MongoDB and start server
console.log('🔌 Connecting to MongoDB...');
mongoose.connect(mongoUri)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully');
    
    const server = app.listen(port, '0.0.0.0', () => {
      console.log(`✨ X1Chat Server is running on port ${port} in ${process.env.NODE_ENV || 'development'} mode`);
    });

    // Handle server shutdown gracefully
    const shutdown = () => {
      console.log('\n⚠️  Shutting down server...');
      server.close(() => {
        console.log('HTTP server closed');
        mongoose.connection.close(false).then(() => {
          console.log('MongoDB connection closed');
          process.exit(0);
        });
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  });
