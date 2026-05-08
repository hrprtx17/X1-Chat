import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Zap, Plus } from 'lucide-react';
import Navbar from '../components/Navbar';
import ChatBubble from '../components/ChatBubble';
import API from '../utils/axios';
import toast, { Toaster } from 'react-hot-toast';

const suggestions = [
  'I cannot login to my account',
  'I need a refund for my order',
  'How do I track my delivery?',
  'I found a bug in the app',
];

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi! I\'m X1Chat AI. How can I help you today? 👋' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    setLoading(true);

    try {
      const { data } = await API.post('/chat', { message: msg });
      setMessages(prev => [...prev, { role: 'bot', text: data.reply }]);
      if (data.escalated) {
        setMessages(prev => [...prev, {
          role: 'system',
          text: '⚠️ Your issue has been escalated. A high priority ticket has been created automatically.'
        }]);
        toast('Ticket created automatically', { icon: '🎫' });
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Sorry, something went wrong. Please try again.' }]);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-dark flex flex-col">
      <Toaster position="top-center" toastOptions={{ style: { background: '#0D0D14', color: '#fff', border: '1px solid rgba(0,217,126,0.2)' } }} />
      <Navbar />

      <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-4 py-6">
        {/* Header */}
        <div className="glass-card p-4 mb-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center">
            <Zap size={18} className="text-primary" />
          </div>
          <div>
            <h2 className="text-white font-semibold text-sm">X1Chat AI Assistant</h2>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
              <span className="text-primary text-xs">Online</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-2 mb-4 min-h-0" style={{ maxHeight: 'calc(100vh - 320px)' }}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChatBubble message={msg} />
            </motion.div>
          ))}
          {loading && (
            <div className="flex gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-dark-card border border-primary/20 flex items-center justify-center flex-shrink-0">
                <Zap size={14} className="text-primary" />
              </div>
              <div className="glass px-4 py-3 rounded-2xl rounded-tl-sm">
                <div className="flex gap-1 items-center h-4">
                  {[0, 1, 2].map(i => (
                    <span key={i} className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <div className="grid grid-cols-2 gap-2 mb-4">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => sendMessage(s)}
                className="glass text-left px-3 py-2.5 rounded-xl text-xs text-gray-400 hover:text-white hover:border-primary/30 transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="glass-card p-3">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder="Type your message..."
              className="flex-1 bg-transparent text-white placeholder-gray-600 text-sm focus:outline-none px-2"
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center disabled:opacity-40 hover:bg-primary-dark transition-all flex-shrink-0"
            >
              <Send size={15} className="text-dark" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}