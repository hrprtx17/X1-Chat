// Load environment variables FIRST
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Global error handlers to prevent silent crashes
process.on('uncaughtException', (err) => {
  console.error('❌ UNCAUGHT EXCEPTION:', err);
  console.error('Stack:', err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ UNHANDLED REJECTION at:', promise, 'reason:', reason);
  process.exit(1);
});

// Load routes
const authRoutes = require('./routes/auth');
const ticketRoutes = require('./routes/tickets');
const faqRoutes = require('./routes/faqs');
const chatRoutes = require('./routes/chatbot');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/chat', chatRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'X1Chat API Running!',
    version: '1.0.0',
    status: 'healthy'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Express error middleware (must be last)
app.use((err, req, res, next) => {
  console.error('🔴 Express Error:', err.message);
  console.error('Stack:', err.stack);
  res.status(err.status || 500).json({ 
    message: 'Server error',
    error: process.env.NODE_ENV === 'production' ? undefined : err.message
  });
});

// Configuration validation and startup
const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGO_URI;

console.log('='.repeat(60));
console.log('🚀 X1Chat Backend Initializing...');
console.log('='.repeat(60));

// Validate required environment variables
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(v => !process.env[v]);

if (missingEnvVars.length > 0) {
  console.error(`❌ STARTUP FAILED: Missing environment variables: ${missingEnvVars.join(', ')}`);
  console.error('Please set the following before starting:');
  missingEnvVars.forEach(v => console.error(`  - ${v}`));
  process.exit(1);
}

console.log(`📋 Configuration:`);
console.log(`   PORT: ${port}`);
console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
console.log(`   MONGO_URI: ${mongoUri.substring(0, 30)}...`);
console.log(`   JWT_SECRET: [configured]`);
console.log(`   GROQ_API_KEY: ${process.env.GROQ_API_KEY ? '[configured]' : '[not configured]'}`);
console.log('');

// Connect to MongoDB and start server
console.log('🔌 Connecting to MongoDB...');
mongoose.connect(mongoUri, {
  retryWrites: true,
  w: 'majority'
})
  .then(() => {
    console.log('✅ MongoDB Connected Successfully');
    console.log('');
    
    const server = app.listen(port, '0.0.0.0', () => {
      console.log('='.repeat(60));
      console.log(`✨ X1Chat Server is running on port ${port}`);
      console.log('='.repeat(60));
      console.log('📍 API Base URL: http://localhost:' + port);
      console.log('📍 Health Check: http://localhost:' + port + '/');
      console.log('='.repeat(60));
    });

    // Handle server shutdown gracefully
    process.on('SIGTERM', () => {
      console.log('\n⚠️  SIGTERM signal received: closing HTTP server');
      server.close(() => {
        console.log('HTTP server closed');
        mongoose.connection.close(false, () => {
          console.log('MongoDB connection closed');
          process.exit(0);
        });
      });
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.error('Full error:', err);
    console.error('');
    console.error('Troubleshooting:');
    console.error('  1. Check MONGO_URI environment variable');
    console.error('  2. Verify MongoDB cluster is accessible');
    console.error('  3. Check network connectivity');
    console.error('  4. Verify IP whitelist in MongoDB Atlas');
    process.exit(1);
  });
