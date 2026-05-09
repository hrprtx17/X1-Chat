const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const { protect, adminOnly } = require('../middleware/authmiddleware');

// User - get my tickets
router.get('/', protect, async (req, res) => {
  try {
    const { status, priority, search } = req.query;
    let query = { userId: req.user.id };
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (search) query.title = { $regex: search, $options: 'i' };
    const tickets = await Ticket.find(query).sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin - get all tickets
router.get('/all', protect, adminOnly, async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create ticket
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, priority } = req.body;
    if (!title || !description)
      return res.status(400).json({ message: 'Title and description required' });
    const ticket = await Ticket.create({
      title, description,
      priority: priority || 'medium',
      userId: req.user.id
    });
    res.status(201).json({ message: 'Ticket created', ticket });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update ticket
router.put('/:id', protect, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    if (ticket.userId.toString() !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized' });
    const updated = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'Ticket updated', ticket: updated });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete ticket
router.delete('/:id', protect, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    if (ticket.userId.toString() !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized' });
    await Ticket.findByIdAndDelete(req.params.id);
    res.json({ message: 'Ticket deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;