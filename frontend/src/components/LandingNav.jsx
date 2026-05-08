import { useNavigate } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { useState } from 'react';

export default function LandingNav() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <nav className="glass border-b border-[#00D97E]/10 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <Zap size={16} className="text-dark" />
        </div>
        <span className="font-bold text-white text-lg">X1Chat</span>
      </div>

      <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
        <a href="#features" className="hover:text-white transition">Features</a>
        <a href="#howitworks" className="hover:text-white transition">How it works</a>
        <a href="#stats" className="hover:text-white transition">Stats</a>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/login')}
          className="text-sm text-gray-400 hover:text-white transition px-4 py-2"
        >
          Login
        </button>
        <button
          onClick={() => navigate('/register')}
          className="btn-primary text-sm py-2 px-5"
        >
          Get Started
        </button>
      </div>
    </nav>
  );
}