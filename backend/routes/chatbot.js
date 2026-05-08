const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');
const Chat = require('../models/Chat');
const Ticket = require('../models/Ticket');
const FAQ = require('../models/FAQ');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const detectIntent = (message) => {
  const msg = message.toLowerCase();
  if (msg.includes('refund') || msg.includes('money') || msg.includes('charge') || msg.includes('billing')) return 'billing';
  if (msg.includes('login') || msg.includes('password') || msg.includes('account') || msg.includes('sign')) return 'auth';
  if (msg.includes('delivery') || msg.includes('shipping') || msg.includes('order') || msg.includes('track')) return 'delivery';
  if (msg.includes('bug') || msg.includes('error') || msg.includes('not working') || msg.includes('broken') || msg.includes('crash')) return 'technical';
  if (msg.includes('cancel') || msg.includes('subscription') || msg.includes('plan') || msg.includes('upgrade')) return 'subscription';
  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || msg.includes('help')) return 'greeting';
  return 'general';
};

const shouldEscalate = (message) => {
  const keywords = ['urgent', 'angry', 'frustrated', 'unacceptable', 'lawsuit', 'scam', 'fraud', 'complaint', 'manager', 'terrible', 'worst', 'useless'];
  return keywords.some(w => message.toLowerCase().includes(w));
};

router.post('/', protect, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: 'Message required' });

    const intent = detectIntent(message);
    const escalate = shouldEscalate(message);

    const faqs = await FAQ.find({ isActive: true });
    const matchingFAQ = faqs.find(f =>
      message.toLowerCase().split(' ').some(word =>
        f.question.toLowerCase().includes(word) && word.length > 3
      )
    );

    const systemPrompt = `You are X1Chat, a helpful AI customer support assistant.
Be friendly, professional and concise.
User intent: ${intent}.
${matchingFAQ ? `Relevant FAQ — Q: ${matchingFAQ.question} A: ${matchingFAQ.answer}` : ''}
Keep responses under 80 words.
If issue is complex or unresolved, suggest creating a support ticket.`;

    const result = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      model: 'llama-3.1-8b-instant',
      max_tokens: 200
    });

    const botReply = result.choices[0]?.message?.content || 'Sorry, I could not process that. Please try again.';

    let ticketCreated = null;
    if (escalate) {
      ticketCreated = await Ticket.create({
        title: `Auto-escalated: ${message.substring(0, 60)}`,
        description: message,
        priority: 'high',
        userId: req.user.id,
        status: 'open'
      });
    }

    const chat = await Chat.create({
      userId: req.user.id,
      userMessage: message,
      botReply,
      intent,
      escalated: escalate
    });

    res.json({
      reply: botReply,
      intent,
      escalated: escalate,
      ticketCreated: escalate,
      chatId: chat._id,
      matchedFAQ: matchingFAQ ? matchingFAQ.question : null
    });

  } catch (err) {
    console.error('Chatbot error:', err.message);
    res.status(500).json({ message: 'Chatbot error', error: err.message });
  }
});

router.get('/history', protect, async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.user.id })
      .sort({ createdAt: -1 }).limit(50);
    res.json(chats);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const totalChats = await Chat.countDocuments();
    const escalatedChats = await Chat.countDocuments({ escalated: true });
    const totalTickets = await Ticket.countDocuments();
    const openTickets = await Ticket.countDocuments({ status: 'open' });
    const resolvedTickets = await Ticket.countDocuments({ status: 'resolved' });
    const totalUsers = await Chat.distinct('userId');

    const intentStats = await Chat.aggregate([
      { $group: { _id: '$intent', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const ticketsByStatus = await Ticket.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const last7Days = await Chat.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      totalChats,
      escalatedChats,
      totalTickets,
      openTickets,
      resolvedTickets,
      totalUsers: totalUsers.length,
      intentStats,
      ticketsByStatus,
      last7Days
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/recent', protect, adminOnly, async (req, res) => {
  try {
    const recentChats = await Chat.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(recentChats);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
// GET /api/chat/daily - last 7 days chart data
router.get('/daily', protect, adminOnly, async (req, res) => {
  try {
    const last7Days = await Chat.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    res.json(last7Days);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/admin/activity - recent activity feed
router.get('/activity', protect, adminOnly, async (req, res) => {
  try {
    const recentChats = await Chat.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);
    const recentTickets = await Ticket.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);
    res.json({ recentChats, recentTickets });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;