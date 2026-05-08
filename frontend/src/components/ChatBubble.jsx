import { Zap, User } from 'lucide-react';

export default function ChatBubble({ message }) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  if (isSystem) {
    return (
      <div className="flex justify-center my-2">
        <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-4 py-2 rounded-xl text-xs max-w-md text-center">
          {message.text}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-4`}>
      <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
        isUser ? 'bg-primary/20 border border-primary/30' : 'bg-dark-card border border-[#00D97E]/20'
      }`}>
        {isUser ? <User size={14} className="text-primary" /> : <Zap size={14} className="text-primary" />}
      </div>
      <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
        isUser
          ? 'bg-primary text-dark font-medium rounded-tr-sm'
          : 'glass text-gray-200 rounded-tl-sm'
      }`}>
        {message.text}
      </div>
    </div>
  );
}