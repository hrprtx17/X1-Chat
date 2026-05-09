import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Paperclip, Bot, RotateCcw, MessageCircle, Zap } from 'lucide-react';
import API from '../utils/axios';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const quickSuggestions = [
  'I was charged twice this month',
  'How do I reset my password?',
  'Track my order',
  'Report a bug'
];

export default function Chat({ isDark }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [escalated, setEscalated] = useState(false);
  const bottomRef = useRef(null);

  const firstName = user?.name?.split(' ')[0] || 'there';

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: 'ai',
          text: `Hi ${firstName} — I'm X1, your AI support assistant. Ask me anything about your account, billing, or our API.`
        }
      ]);
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    setLoading(true);

    try {
      const { data } = await API.post('/chat', { message: msg });
      setMessages(prev => [...prev, { role: 'ai', text: data.reply || data.message }]);

      if (data.escalated) {
        setEscalated(true);
        setTimeout(() => setEscalated(false), 5000);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        role: 'ai',
        text: 'Sorry, something went wrong. Please try again later.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([
      {
        role: 'ai',
        text: `Hi ${firstName} — I'm X1, your AI support assistant. Ask me anything about your account, billing, or our API.`
      }
    ]);
    setEscalated(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] max-w-2xl mx-auto">
      <Toaster position="top-center" />

      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white flex-shrink-0">
            <Zap size={20} />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">AI Assistant</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Powered by your knowledge base. Streamed token-by-token.
            </p>
          </div>
        </div>
        <button
          onClick={handleNewChat}
          className="flex items-center gap-2 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors text-sm font-medium"
        >
          <RotateCcw size={16} />
          New chat
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'ai' && (
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white flex-shrink-0">
                <Bot size={16} />
              </div>
            )}

            <div
              className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-orange-500 text-white rounded-br-none'
                  : isDark
                  ? 'bg-gray-900 text-gray-200 rounded-tl-none'
                  : 'bg-gray-100 text-gray-800 rounded-tl-none'
              }`}
            >
              <p className="text-sm leading-relaxed">{msg.text}</p>
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                {getInitials(user?.name)}
              </div>
            )}
          </motion.div>
        ))}

        {/* Typing Indicator */}
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white flex-shrink-0">
              <Bot size={16} />
            </div>
            <div className={`px-4 py-2.5 rounded-lg ${
              isDark
                ? 'bg-gray-900 rounded-tl-none'
                : 'bg-gray-100 rounded-tl-none'
            }`}>
              <div className="flex gap-1 items-center h-4">
                {[0, 1, 2].map(i => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Escalation Notice */}
        {escalated && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mx-auto max-w-xs bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-lg p-3 text-center"
          >
            <p className="text-sm text-orange-800 dark:text-orange-300 font-medium">
              🎫 A support ticket has been created for your issue.
            </p>
          </motion.div>
        )}

        {/* Quick Suggestions - Show only on first message */}
        {messages.length === 1 && !loading && (
          <div className="grid grid-cols-2 gap-2 mt-6">
            {quickSuggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(suggestion)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors border ${
                  isDark
                    ? 'border-gray-700 text-gray-300 hover:bg-gray-900/50'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className={`border-t ${
        isDark
          ? 'border-gray-700 bg-gray-800'
          : 'border-gray-200 bg-white'
      } p-4`}>
        <div className={`flex items-end gap-3 px-4 py-3 rounded-lg border ${
          isDark
            ? 'border-gray-700 bg-gray-900'
            : 'border-gray-200 bg-gray-50'
        }`}>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors flex-shrink-0"
            title="Attach file"
          >
            <Paperclip size={18} />
          </button>

          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Ask anything..."
            className={`flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none text-sm`}
            disabled={loading}
          />

          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors flex-shrink-0"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}