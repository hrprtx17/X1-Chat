const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true, trim: true },
  answer: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['general', 'billing', 'technical', 'account', 'other'], 
    default: 'general' 
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('FAQ', faqSchema);