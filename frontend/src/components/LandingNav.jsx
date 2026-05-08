import { useNavigate } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { useState } from 'react';

export default function LandingNav() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <nav className="glass border-b border-white/10 px-4 md:px-6 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-300 to-emerald-200 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Zap size={16} className="text-slate-900" />
          </div>
          <span className="font-semibold text-white text-lg tracking-tight">X1Chat</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm text-slate-300">
          <a href="#features" className="hover:text-white transition">Features</a>
          <a href="#howitworks" className="hover:text-white transition">How it works</a>
          <a href="#stats" className="hover:text-white transition">Impact</a>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/login')} className="hidden sm:block text-sm text-slate-300 hover:text-white transition px-4 py-2">
            Login
          </button>
          <button onClick={() => navigate('/register')} className="btn-primary text-sm py-2 px-5">
            Start Free
          </button>
          <button className="md:hidden text-slate-200 px-3 py-2" onClick={() => setOpen(!open)}>
            Menu
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden mt-3 pt-3 border-t border-white/10 flex flex-col gap-2 text-sm text-slate-300">
          <a href="#features" onClick={() => setOpen(false)} className="glass px-3 py-2 rounded-xl">Features</a>
          <a href="#howitworks" onClick={() => setOpen(false)} className="glass px-3 py-2 rounded-xl">How it works</a>
          <a href="#stats" onClick={() => setOpen(false)} className="glass px-3 py-2 rounded-xl">Impact</a>
          <button onClick={() => navigate('/login')} className="glass px-3 py-2 rounded-xl text-left">Login</button>
        </div>
      )}
    </nav>
  );
}