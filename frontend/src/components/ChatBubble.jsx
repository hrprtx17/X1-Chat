import { Bot, User } from 'lucide-react';

export default function ChatBubble({ message }) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  if (isSystem) {
    return (
      <div className="flex justify-center my-2">
        <div className="bg-amber-400/10 border border-amber-300/20 text-amber-200 px-4 py-2 rounded-xl text-xs max-w-md text-center">
          {message.text}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-4`}>
      <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
        isUser ? 'bg-indigo-400/20 border border-indigo-300/30' : 'bg-slate-900/80 border border-cyan-200/20'
      }`}>
        {isUser ? <User size={14} className="text-indigo-200" /> : <Bot size={14} className="text-cyan-200" />}
      </div>
      <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
        isUser
          ? 'bg-gradient-to-br from-indigo-300 to-emerald-200 text-slate-900 font-medium rounded-tr-sm'
          : 'glass text-slate-100 rounded-tl-sm border border-white/10'
      }`}>
        {message.text}
      </div>
    </div>
  );
}