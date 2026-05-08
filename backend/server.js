require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const ticketRoutes = require('./routes/tickets');
const faqRoutes = require('./routes/faqs');
const chatRoutes = require('./routes/chatbot');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/chat', chatRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'X1Chat API Running!',
    version: '1.0.0',
    status: 'healthy'
  });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.error('Missing MONGO_URI. Set the MONGO_URI environment variable before starting the backend.');
} else {
  mongoose.connect(mongoUri)
    .then(() => {
      console.log('✅ MongoDB Connected');
      app.listen(port, () => {
        console.log(`🚀 X1Chat Server running on port ${port}`);
      });
    })
    .catch((err) => {
      console.error('❌ MongoDB Error:', err.message);
    });
}
