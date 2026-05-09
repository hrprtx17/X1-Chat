// Load environment variables FIRST
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth');
const ticketRoutes = require('./routes/tickets');
const faqRoutes = require('./routes/faqs');
const chatRoutes = require('./routes/chatbot');

const app = express();

// Trust proxy for secure cookies
app.set('trust proxy', 1);

// STRICT CORS CONFIGURATION - No Wildcards
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://x1-chat.vercel.app',
  'https://x1-chat-app.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1 || (process.env.NODE_ENV !== 'production')) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked for origin: ${origin}`);
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
