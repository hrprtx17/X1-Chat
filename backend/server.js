// Load environment variables FIRST
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth');
const ticketRoutes = require('./routes/tickets');
const faqRoutes = require('./routes/faqs');
const chatRoutes = require('./routes/chatbot');

const app = express();

// Trust proxy for secure cookies
app.set('trust proxy', 1);

// MANUAL CORS MIDDLEWARE - Ultimate control to prevent wildcard '*' issues
app.use((req, res, next) => {
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://x1-chat.vercel.app',
    'https://x1-chat-app.vercel.app'
  ];
  
  const origin = req.headers.origin;
  
  // If the request origin is in our whitelist, mirror it exactly in the response
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else if (!origin && process.env.NODE_ENV !== 'production') {
    // For local development tools like postman/curl if needed
    res.setHeader('Access-Control-Allow-Origin', '*');
  }

  // REQUIRED for withCredentials: true
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Allowed methods and headers
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Cookie');
  
  // Expose headers for the frontend (like Set-Cookie)
  res.setHeader('Access-Control-Expose-Headers', 'Set-Cookie');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/chat', chatRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'X1Chat API Active', status: 'healthy' });
});

// Port and DB
const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGO_URI;

mongoose.connect(mongoUri)
  .then(() => {
    console.log('✅ MongoDB Connected');
    app.listen(port, '0.0.0.0', () => {
      console.log(`✨ Server running on port ${port}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  });
