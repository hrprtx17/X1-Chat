const mongoose = require('mongoose');

// Prevent model recompilation error
if (mongoose.models.Ticket) {
  module.exports = mongoose.models.Ticket;
} else {
  const ticketSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['open', 'in-progress', 'resolved', 'closed'], default: 'open' },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  }, { timestamps: true });

  module.exports = mongoose.model('Ticket', ticketSchema);
}