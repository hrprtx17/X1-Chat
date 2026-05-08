import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles } from 'lucide-react';
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
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: 'Sorry, something went wrong. Please try again.' }]);
    }
    setLoading(false);
  };

  return (
    <div className="app-shell min-h-screen flex flex-col">
      <Toaster position="top-center" toastOptions={{ style: { background: 'var(--surface-strong)', color: 'var(--text-main)', border: '1px solid var(--border-soft)' } }} />
      <Navbar />

      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 py-6">
        <div className="glass-card p-4 mb-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-200/35 border border-orange-300/30 rounded-xl flex items-center justify-center">
            <Sparkles size={18} className="text-[var(--brand)]" />
          </div>
          <div>
            <h2 className="text-[var(--text-main)] font-semibold text-sm">X1Chat AI Assistant</h2>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-[var(--brand)] rounded-full animate-pulse" />
              <span className="text-[var(--text-soft)] text-xs">Online and ready</span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 mb-4 min-h-0 pr-1" style={{ maxHeight: 'calc(100vh - 320px)' }}>
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
              <div className="w-8 h-8 rounded-full glass border border-orange-200/40 flex items-center justify-center flex-shrink-0">
                <Sparkles size={14} className="text-[var(--brand)]" />
              </div>
              <div className="glass px-4 py-3 rounded-2xl rounded-tl-sm border border-orange-200/40">
                <div className="flex gap-1 items-center h-4">
                  {[0, 1, 2].map(i => (
                    <span key={i} className="w-1.5 h-1.5 bg-[var(--brand)] rounded-full animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {messages.length <= 1 && (
          <div className="grid grid-cols-2 gap-2 mb-4">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => sendMessage(s)}
                className="glass text-left px-3 py-2.5 rounded-xl text-xs text-[var(--text-soft)] hover:text-[var(--text-main)] hover:border-orange-300/50 transition-all tap"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="glass-card p-3">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder="Ask anything about your support issue..."
              className="flex-1 bg-transparent text-[var(--text-main)] placeholder-[var(--text-soft)] text-sm focus:outline-none px-2"
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="w-9 h-9 bg-gradient-to-br from-orange-400 to-amber-300 rounded-xl flex items-center justify-center disabled:opacity-40 transition-all flex-shrink-0 tap"
            >
              <Send size={15} className="text-amber-950" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}