import { useState, useRef, useEffect, useCallback } from 'react';
import API from '../utils/axios';
import { 
  Send, Bot, User as UserIcon, MoreVertical, Trash2, Copy, 
  ThumbsUp, ThumbsDown, RefreshCw, Sparkles, Check, Mic, Zap
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingDots = () => (
  <div className="flex gap-1.5 py-2 px-1">
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className="w-1.5 h-1.5 bg-primary rounded-full"
        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 0.8, delay: i * 0.15, repeat: Infinity, ease: 'easeInOut' }}
      />
    ))}
  </div>
);

export default function Chat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const scrollRef = useRef();
  const inputRef = useRef();

  const loadHistory = useCallback(async () => {
    try {
      setHistoryLoading(true);
      const { data } = await API.get('/chat/history');
      if (Array.isArray(data) && data.length > 0) {
        const msgs = [];
        [...data].reverse().forEach((chat) => {
          if (chat?.userMessage) msgs.push({ role: 'user', text: chat.userMessage, id: Math.random().toString(), time: chat.createdAt });
          if (chat?.botReply) msgs.push({ role: 'bot', text: chat.botReply, id: Math.random().toString(), time: chat.createdAt });
        });
        setMessages(msgs);
      } else {
        setMessages([{ role: 'bot', text: `Hi ${user?.name?.split(' ')[0] ?? 'there'} 👋 Welcome to X1 Chat. I'm here to assist you with technical support, billing, or any other queries. How can I help you today?`, id: 'initial', time: new Date() }]);
      }
    } catch {
      setMessages([{ role: 'bot', text: 'Hi! How can I help you today?', id: 'initial', time: new Date() }]);
    } finally {
      setHistoryLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    const text = input?.trim();
    if (!text || loading) return;
    
    setInput('');
    if (inputRef.current) inputRef.current.style.height = 'auto';
    
    const userMsgId = Math.random().toString();
    setMessages((prev) => [...prev, { role: 'user', text, id: userMsgId, time: new Date() }]);
    setLoading(true);
    
    try {
      const { data } = await API.post('/chat', { message: text });
      const reply = data?.reply || data?.message || "I'm sorry, I couldn't process that.";
      setMessages((prev) => [...prev, { role: 'bot', text: reply, id: Math.random().toString(), time: new Date() }]);
      if (data?.escalated || data?.ticketCreated) {
        setMessages((prev) => [...prev, { role: 'system', text: 'A support ticket has been automatically created for your issue.', id: Math.random().toString(), time: new Date() }]);
      }
    } catch {
      setMessages((prev) => [...prev, { role: 'bot', text: 'Sorry, I encountered an error. Please try again.', id: Math.random().toString(), error: true, time: new Date() }]);
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-white dark:bg-[#0D0D10] rounded-[2.5rem] border border-gray-100 dark:border-white/5 overflow-hidden shadow-2xl shadow-gray-200/50 dark:shadow-none relative">
      
      {/* Header */}
      <div className="h-20 px-8 md:px-12 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-white/80 dark:bg-[#0D0D10]/80 backdrop-blur-xl sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
            <Bot size={22} />
          </div>
          <div>
            <h2 className="text-sm font-black text-gray-900 dark:text-white tracking-tight uppercase tracking-widest">X1 Chat</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Neural Engine Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <button onClick={() => setMessages([])} className="p-2.5 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl text-gray-400 hover:text-red-500 transition-all tooltip" title="Clear Conversation">
             <Trash2 size={18} />
           </button>
           <button className="p-2.5 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl text-gray-400 transition-all">
             <MoreVertical size={18} />
           </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-6 md:px-12 lg:px-32 py-10 no-scrollbar">
        <div className="max-w-3xl mx-auto space-y-12 pb-10">
          {historyLoading ? (
            <div className="flex flex-col items-center justify-center py-40 gap-6">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
                <Zap size={18} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary opacity-50" />
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Synchronizing Intelligence...</p>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <motion.div
                  key={msg.id || i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className={`flex gap-6 w-full ${msg?.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {msg?.role === 'system' ? (
                    <div className="w-full flex justify-center py-4">
                      <div className="bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 px-6 py-3 rounded-[2rem] border border-emerald-500/10 text-[11px] font-black uppercase tracking-widest flex items-center gap-3 shadow-sm">
                        <Sparkles size={14} className="animate-pulse" />
                        {msg?.text}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className={`w-10 h-10 rounded-2xl shrink-0 flex items-center justify-center shadow-lg transition-transform hover:scale-110 ${
                        msg?.role === 'bot'
                          ? 'bg-primary text-white shadow-primary/20'
                          : 'bg-white dark:bg-[#1E1E25] text-gray-400 border border-gray-100 dark:border-white/5'
                      }`}>
                        {msg?.role === 'bot' ? <Bot size={20} /> : <UserIcon size={20} />}
                      </div>
                      
                      <div className={`flex flex-col gap-2 max-w-[85%] sm:max-w-[80%] ${msg?.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className="flex items-center gap-3 px-1">
                          <span className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest">{msg?.role === 'bot' ? 'X1 Chat' : 'User'}</span>
                          <span className="text-[10px] font-bold text-gray-400/60 uppercase">{msg?.time ? new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}</span>
                        </div>

                        <div className={`group relative px-6 py-4 rounded-[1.5rem] text-[15px] leading-relaxed shadow-sm transition-all ${
                          msg?.role === 'bot'
                            ? 'bg-white dark:bg-[#1a1a20] text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-white/5 rounded-tl-none'
                            : 'bg-primary text-white rounded-tr-none shadow-primary/10'
                        } ${msg.error ? 'border-red-500/30 bg-red-50 dark:bg-red-950/20 text-red-600' : ''}`}>
                          <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed">
                            {msg?.text}
                          </div>
                          
                          {msg?.role === 'bot' && !msg.error && (
                            <div className="absolute top-0 -right-14 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0 pt-2">
                              <button onClick={() => copyToClipboard(msg.text, msg.id)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl text-gray-400 transition-all">
                                {copiedId === msg.id ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                              </button>
                              <button className="p-2 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-xl text-gray-400 hover:text-emerald-600 transition-all"><ThumbsUp size={14} /></button>
                              <button className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl text-gray-400 hover:text-red-500 transition-all"><ThumbsDown size={14} /></button>
                              <button className="p-2 hover:bg-primary/5 rounded-xl text-gray-400 hover:text-primary transition-all"><RefreshCw size={14} /></button>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          )}

          {loading && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex gap-6 w-full">
              <div className="w-10 h-10 rounded-2xl shrink-0 bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                <Bot size={20} />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 px-1">
                  <span className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest">X1 Chat</span>
                </div>
                <div className="bg-white dark:bg-[#1a1a20] border border-gray-100 dark:border-white/5 rounded-[1.5rem] rounded-tl-none px-6 py-4 shadow-sm">
                  <LoadingDots />
                </div>
              </div>
            </motion.div>
          )}
          <div ref={scrollRef} className="h-4" />
        </div>
      </div>

      {/* Input Terminal */}
      <div className="p-6 md:p-10 bg-gradient-to-t from-white dark:from-[#0D0D10] via-white dark:via-[#0D0D10] to-transparent sticky bottom-0 z-30 shrink-0">
        <form onSubmit={handleSend} className="max-w-3xl mx-auto relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 via-orange-500/10 to-transparent rounded-[2.5rem] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-1000 pointer-events-none" />
          
          <div className="relative bg-white dark:bg-[#1a1a20] border border-gray-200 dark:border-white/10 rounded-[2rem] shadow-2xl shadow-gray-200/50 dark:shadow-none focus-within:border-primary/30 transition-all overflow-hidden p-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              placeholder={loading ? 'Thinking...' : 'Message X1 Chat...'}
              className="w-full max-h-[200px] bg-transparent resize-none outline-none py-4 px-6 text-[15px] font-bold text-gray-900 dark:text-white placeholder-gray-400 disabled:opacity-50 no-scrollbar"
              rows="1"
            />
              <div className="flex items-center justify-between px-4 pb-2">
                <div className="flex items-center gap-1">
                  {/* Minimized Actions */}
                </div>
              <button
                type="submit"
                disabled={loading || !input?.trim()}
                className={`px-6 py-2.5 rounded-2xl flex items-center justify-center gap-3 transition-all ${
                  input?.trim() && !loading
                    ? 'bg-primary text-white shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]'
                    : 'bg-gray-100 dark:bg-white/5 text-gray-400'
                }`}
              >
                <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">Process Query</span>
                <Send size={16} />
              </button>
            </div>
          </div>
        </form>
      </div>

    </div>
  );
}