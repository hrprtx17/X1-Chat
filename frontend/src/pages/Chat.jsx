import { useState, useRef, useEffect } from 'react';
import API from '../utils/axios';
import { 
  Send, 
  Bot, 
  User as UserIcon, 
  Trash2, 
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
        if (data && data.length > 0) {
          // Convert history to message format (history comes in reverse chronological order usually)
          const historyMessages = [];
          [...data].reverse().forEach(chat => {
            historyMessages.push({ role: 'user', text: chat.userMessage });
            historyMessages.push({ role: 'bot', text: chat.botReply });
          });
          setMessages(historyMessages);
        } else {
          // Show welcome message if no history
          setMessages([{
            role: 'bot',
            text: `Hi ${user?.name?.split(' ')[0] ?? 'there'} 👋 I'm X1, your AI support assistant. How can I help you today?`
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
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', text }]);
    setLoading(true);

    try {
      const { data } = await API.post('/chat', { message: text });
      
      setMessages(prev => [...prev, { role: 'bot', text: data.reply }]);
      
      if (data.escalated || data.ticketCreated) {
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
      text: `Hi ${user?.name?.split(' ')[0] ?? 'there'} 👋 Starting a new conversation. How can I help?`
    }]);
  };

  const LoadingSpinner = () => (
    <div className="flex gap-2 p-1">
      {[0, 1, 2].map(i => (
        <div key={i} 
          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" 
          style={{ animationDelay: `${i * 150}ms` }} 
        />
      ))}
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-[#F9FAFB] dark:bg-gray-950 fade-in">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-8 py-4 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
            <Bot size={24} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">AI Assistant</h1>
            <div className="flex items-center gap-1.5 text-xs text-green-500 font-medium">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Online
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={startNewChat}
            className="btn-secondary px-3 py-2 text-sm"
          >
            <Plus size={16} className="mr-2" />
            New Chat
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-0 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {historyLoading ? (
             <div className="flex justify-center py-20">
                <LoadingSpinner />
             </div>
          ) : (
            messages.map((msg, i) => (
              <div 
                key={i} 
                className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                {msg.role === 'system' ? (
                  <div className="w-full flex justify-center">
                    <div className="bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 px-4 py-2 rounded-lg border border-orange-100 dark:border-orange-800/30 text-xs font-medium flex items-center gap-2">
                      <TicketIcon size={14} />
                      {msg.text}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center border ${
                      msg.role === 'bot' 
                        ? 'bg-white border-gray-200 text-primary dark:bg-gray-800 dark:border-gray-700' 
                        : 'bg-primary border-primary text-white shadow-sm'
                    }`}>
                      {msg.role === 'bot' ? <Bot size={18} /> : <UserIcon size={18} />}
                    </div>
                    <div className={`flex flex-col max-w-[80%] ${msg.role === 'user' ? 'items-end' : ''}`}>
                      <div className={`px-5 py-3 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'bot' 
                          ? 'bg-white text-gray-800 border border-gray-200 shadow-sm dark:bg-gray-900 dark:text-gray-200 dark:border-gray-800 rounded-tl-none' 
                          : 'bg-primary text-white shadow-sm rounded-tr-none'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
          {loading && (
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-300 dark:bg-gray-800 dark:border-gray-700">
                <Bot size={18} />
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none px-5 py-3 shadow-sm dark:bg-gray-900 dark:border-gray-800">
                <LoadingSpinner />
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
            disabled={loading}
            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl pl-5 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-inner text-gray-800 dark:text-gray-200 disabled:opacity-50"
            placeholder={loading ? "AI is thinking..." : "Ask me anything..."}
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
          X1 AI is here to help. Important information should be verified.
        </p>
      </div>
    </div>
  );
}