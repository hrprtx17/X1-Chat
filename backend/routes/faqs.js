const express = require('express');
const router = express.Router();
const FAQ = require('../models/faq');
const { protect, adminOnly } = require('../middleware/authmiddleware');

router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = { isActive: true };
    if (category) query.category = category;
    if (search) query.question = { $regex: search, $options: 'i' };
    const faqs = await FAQ.find(query);
    res.json(faqs);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { question, answer, category } = req.body;
    if (!question || !answer)
      return res.status(400).json({ message: 'Question and answer required' });
    const faq = await FAQ.create({ question, answer, category });
    res.status(201).json({ message: 'FAQ created', faq });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!faq) return res.status(404).json({ message: 'FAQ not found' });
    res.json({ message: 'FAQ updated', faq });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndDelete(req.params.id);
    if (!faq) return res.status(404).json({ message: 'FAQ not found' });
    res.json({ message: 'FAQ deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;