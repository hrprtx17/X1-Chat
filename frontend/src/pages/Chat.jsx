import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { 
  Send, 
  Bot, 
  User as UserIcon, 
  Loader2, 
  Trash2, 
  MessageSquare,
  Plus,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Chat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! I'm your X1 AI assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('/api/chat', { 
        messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })) 
      });
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.content }]);
    } catch (err) {
      toast.error('AI is currently unavailable');
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I encountered an error. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#F9FAFB] dark:bg-gray-950 fade-in">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-8 py-4 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
            <Bot size={24} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">AI Chatbot</h1>
            <div className="flex items-center gap-1.5 text-xs text-green-500 font-medium">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              AI Assistant Online
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setMessages([{ role: 'assistant', content: "Hello! I'm your X1 AI assistant. How can I help you today?" }])}
            className="btn-secondary px-3 py-2 text-sm"
          >
            <Trash2 size={16} className="mr-2" />
            Clear
          </button>
          <button className="btn-primary px-3 py-2 text-sm">
            <Plus size={16} className="mr-2" />
            New Session
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-0 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((msg, i) => (
            <div 
              key={i} 
              className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
              <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center border ${
                msg.role === 'assistant' 
                  ? 'bg-white border-gray-200 text-primary dark:bg-gray-800 dark:border-gray-700' 
                  : 'bg-primary border-primary text-white shadow-sm'
              }`}>
                {msg.role === 'assistant' ? <Bot size={18} /> : <UserIcon size={18} />}
              </div>
              <div className={`flex flex-col max-w-[80%] ${msg.role === 'user' ? 'items-end' : ''}`}>
                <div className={`px-5 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'assistant' 
                    ? 'bg-white text-gray-800 border border-gray-200 shadow-sm dark:bg-gray-900 dark:text-gray-200 dark:border-gray-800 rounded-tl-none' 
                    : 'bg-primary text-white shadow-sm rounded-tr-none'
                }`}>
                  {msg.content}
                </div>
                <span className="mt-1.5 text-[10px] text-gray-400 font-medium px-1 uppercase tracking-wider">
                  {msg.role === 'assistant' ? 'AI Assistant' : user?.name || 'You'} • Just now
                </span>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-start gap-4 animate-pulse">
              <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-300 dark:bg-gray-800 dark:border-gray-700">
                <Bot size={18} />
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none px-5 py-3 shadow-sm dark:bg-gray-900 dark:border-gray-800">
                <div className="flex gap-1.5 py-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce" />
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-6 shrink-0">
        <form onSubmit={handleSend} className="max-w-3xl mx-auto relative">
          <input
            type="text"
            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl pl-5 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-inner text-gray-800 dark:text-gray-200"
            placeholder="Type your message here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="absolute right-2 top-2 p-3 bg-primary text-white rounded-xl hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <Send size={18} />
          </button>
        </form>
        <p className="text-center text-[10px] text-gray-400 mt-3 font-medium uppercase tracking-widest">
          X1 AI can make mistakes. Check important info.
        </p>
      </div>
    </div>
  );
}