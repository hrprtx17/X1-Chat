import { useNavigate } from 'react-router-dom';
import { Zap, Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function LandingNav() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.setAttribute('data-theme', next);
  };

  return (
    <nav className="glass border-b border-orange-200/40 px-4 md:px-6 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-amber-300 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Zap size={16} className="text-amber-950" />
          </div>
          <span className="font-semibold text-[var(--text-main)] text-lg tracking-tight">X1Chat</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm text-[var(--text-soft)]">
          <a href="#testimonials" className="hover:text-[var(--text-main)] transition">Testimonials</a>
          <a href="#features" className="hover:text-[var(--text-main)] transition">Features</a>
          <a href="#assistant" className="hover:text-[var(--text-main)] transition">Assistant</a>
          <a href="#howitworks" className="hover:text-[var(--text-main)] transition">How it works</a>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-xl glass flex items-center justify-center text-[var(--text-main)]"
            aria-label="Toggle dark mode"
          >
            {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
          </button>
          <button onClick={() => navigate('/login')} className="hidden sm:block text-sm text-[var(--text-soft)] hover:text-[var(--text-main)] transition px-4 py-2">
            Login
          </button>
          <button onClick={() => navigate('/register')} className="btn-primary text-sm py-2 px-5">
            Start Free
          </button>
          <button className="md:hidden text-[var(--text-main)] px-3 py-2" onClick={() => setOpen(!open)}>
            Menu
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden mt-3 pt-3 border-t border-orange-200/40 flex flex-col gap-2 text-sm text-[var(--text-soft)]">
          <a href="#testimonials" onClick={() => setOpen(false)} className="glass px-3 py-2 rounded-xl">Testimonials</a>
          <a href="#features" onClick={() => setOpen(false)} className="glass px-3 py-2 rounded-xl">Features</a>
          <a href="#assistant" onClick={() => setOpen(false)} className="glass px-3 py-2 rounded-xl">Assistant</a>
          <a href="#howitworks" onClick={() => setOpen(false)} className="glass px-3 py-2 rounded-xl">How it works</a>
          <button onClick={() => navigate('/login')} className="glass px-3 py-2 rounded-xl text-left">Login</button>
        </div>
      )}
    </nav>
  );
}