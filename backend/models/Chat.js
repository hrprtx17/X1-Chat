const mongoose = require('mongoose');

if (mongoose.models.Chat) {
  module.exports = mongoose.models.Chat;
} else {
  const chatSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userMessage: { type: String, required: true },
    botReply: { type: String, required: true },
    intent: { type: String, default: 'general' },
    escalated: { type: Boolean, default: false }
  }, { timestamps: true });

  module.exports = mongoose.model('Chat', chatSchema);
}