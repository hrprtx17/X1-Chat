import { Bot, User } from 'lucide-react';

export default function ChatBubble({ message }) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  if (isSystem) {
    return (
      <div className="flex justify-center my-2">
        <div className="bg-orange-200/35 border border-orange-300/30 text-[var(--text-main)] px-4 py-2 rounded-xl text-xs max-w-md text-center">
          {message.text}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-4`}>
      <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
        isUser ? 'bg-orange-200/40 border border-orange-300/35' : 'glass border border-orange-200/40'
      }`}>
        {isUser ? <User size={14} className="text-[var(--brand)]" /> : <Bot size={14} className="text-[var(--brand)]" />}
      </div>
      <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
        isUser
          ? 'bg-gradient-to-br from-orange-400 to-amber-300 text-amber-950 font-medium rounded-tr-sm'
          : 'glass text-[var(--text-main)] rounded-tl-sm border border-orange-200/35'
      }`}>
        {message.text}
      </div>
    </div>
  );
}