import { useState, useRef, useEffect } from 'react';
import API from '../utils/axios';
import { 
  Send, 
  Bot, 
  User as UserIcon, 
  Plus,
  Ticket as TicketIcon
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Chat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const scrollRef = useRef();

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setHistoryLoading(true);
        const { data } = await API.get('/chat/history');
        if (Array.isArray(data) && data.length > 0) {
          const historyMessages = [];
          [...data].reverse().forEach(chat => {
            if (chat?.userMessage) historyMessages.push({ role: 'user', text: chat.userMessage });
            if (chat?.botReply) historyMessages.push({ role: 'bot', text: chat.botReply });
          });
          setMessages(historyMessages);
        } else {
          setMessages([{
            role: 'bot',
            text: `Hi ${user?.name?.split(' ')?.filter(Boolean)?.[0] ?? 'there'} 👋 I'm X1, your AI support assistant. How can I help you today?`
          }]);
        }
      } catch (err) {
        console.error('Failed to load history:', err);
        setMessages([{
          role: 'bot', 
          text: 'Hi! How can I help you today?'
        }]);
      } finally {
        setHistoryLoading(false);
      }
    };
    loadHistory();
  }, [user]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    const text = input?.trim();
    if (!text || loading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', text }]);
    setLoading(true);

    try {
      const { data } = await API.post('/chat', { message: text });
      
      const reply = data?.reply || data?.message || "I'm sorry, I couldn't process that.";
      setMessages(prev => [...prev, { role: 'bot', text: reply }]);
      
      if (data?.escalated || data?.ticketCreated) {
        setMessages(prev => [...prev, {
          role: 'system',
          text: '🎫 A support ticket has been automatically created for your issue.'
        }]);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: 'Sorry, I encountered an error. Please try again.' 
      }]);
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const startNewChat = () => {
    setMessages([{
      role: 'bot',
      text: `Hi ${user?.name?.split(' ')?.filter(Boolean)?.[0] ?? 'there'} 👋 Starting a new conversation. How can I help?`
    }]);
  };

  const LoadingDots = () => (
    <div className="flex gap-1.5 p-1.5">
      {[0, 1, 2].map(i => (
        <div key={i} 
          className="w-1.5 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce" 
          style={{ animationDelay: `${i * 150}ms` }} 
        />
      ))}
    </div>
  );

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm fade-in">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center shadow-inner">
            <Bot size={22} />
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900 dark:text-white leading-tight">AI Assistant</h1>
            <div className="flex items-center gap-1.5 text-[11px] text-green-500 font-bold uppercase tracking-wider">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Active Now
            </div>
          </div>
        </div>
        <button 
          onClick={startNewChat}
          className="btn-secondary px-3 py-1.5 text-xs"
        >
          <Plus size={14} className="mr-1.5" />
          New Chat
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-8 space-y-8 bg-gray-50/30 dark:bg-gray-950/20">
        <div className="max-w-3xl mx-auto space-y-8">
          {historyLoading ? (
             <div className="flex flex-col items-center justify-center py-20 gap-4">
                <LoadingDots />
                <p className="text-xs font-medium text-gray-400">Loading your history...</p>
             </div>
          ) : (
            (messages ?? []).map((msg, i) => (
              <div 
                key={i} 
                className={`flex items-start gap-3 ${msg?.role === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                {msg?.role === 'system' ? (
                  <div className="w-full flex justify-center">
                    <div className="bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 px-4 py-2 rounded-xl border border-orange-100 dark:border-orange-900/30 text-xs font-bold flex items-center gap-2 shadow-sm">
                      <TicketIcon size={14} />
                      {msg?.text ?? ''}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center border shadow-sm ${
                      msg?.role === 'bot' 
                        ? 'bg-white border-gray-100 text-primary dark:bg-gray-800 dark:border-gray-700' 
                        : 'bg-primary border-primary text-white'
                    }`}>
                      {msg?.role === 'bot' ? <Bot size={16} /> : <UserIcon size={16} />}
                    </div>
                    <div className={`flex flex-col max-w-[85%] sm:max-w-[70%] ${msg?.role === 'user' ? 'items-end' : ''}`}>
                      <div className={`px-4 py-3 rounded-2xl text-sm font-medium leading-relaxed shadow-sm ${
                        msg?.role === 'bot' 
                          ? 'bg-white text-gray-800 border border-gray-100 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 rounded-tl-none' 
                          : 'bg-primary text-white rounded-tr-none'
                      }`}>
                        {msg?.text ?? ''}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
          {loading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-300 dark:bg-gray-800 dark:border-gray-700">
                <Bot size={16} />
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none px-4 py-2.5 shadow-sm dark:bg-gray-800 dark:border-gray-700">
                <LoadingDots />
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="px-6 py-5 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
        <form onSubmit={handleSend} className="max-w-3xl mx-auto relative group">
          <input
            type="text"
            disabled={loading}
            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl pl-5 pr-14 py-4 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm text-sm font-medium text-gray-800 dark:text-gray-100 placeholder-gray-400 disabled:opacity-50"
            placeholder={loading ? "Generating response..." : "Describe your issue or ask a question..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading || !input?.trim()}
            className="absolute right-2 top-2 p-3 bg-primary text-white rounded-xl hover:bg-primary-600 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-primary/20"
          >
            <Send size={18} />
          </button>
        </form>
        <p className="text-center mt-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          X1Chat AI can make mistakes. Check important info.
        </p>
      </div>
    </div>
  );
}