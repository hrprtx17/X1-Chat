import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Ticket, LayoutDashboard, LogOut, Zap, Menu, Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [openMobile, setOpenMobile] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('theme', next);
  };

  const links = [
    { path: '/chat', label: 'Chat', icon: MessageSquare },
    { path: '/tickets', label: 'Tickets', icon: Ticket },
    ...(user?.role === 'admin' ? [{ path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }] : [])
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="glass border-b border-orange-200/40 px-4 md:px-6 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <button className="flex items-center gap-3" onClick={() => navigate('/chat')}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-amber-300 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Zap size={16} className="text-amber-950" />
          </div>
          <span className="font-semibold tracking-tight text-[var(--text-main)] text-lg">X1Chat</span>
        </button>

        <div className="hidden md:flex items-center gap-1 p-1 rounded-xl border border-orange-200/40 bg-white/60 dark:bg-white/20">
          {links.map(({ path, label, icon: Icon }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all tap ${
                location.pathname === path
                  ? 'bg-orange-400/15 text-[var(--text-main)] border border-orange-300/40'
                  : 'text-[var(--text-soft)] hover:text-[var(--text-main)] hover:bg-white/40'
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-xl glass flex items-center justify-center text-[var(--text-main)] tap"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
          </button>
          <div className="text-right">
            <p className="text-sm font-medium text-[var(--text-main)]">{user?.name}</p>
            <p className="text-xs text-[var(--text-soft)] capitalize">{user?.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-rose-600 hover:text-rose-700 hover:bg-rose-500/10 transition-all border border-rose-300/40 tap"
          >
            <LogOut size={15} />
            Logout
          </button>
        </div>

        <button
          onClick={() => setOpenMobile(!openMobile)}
          className="md:hidden w-9 h-9 rounded-xl border border-orange-200/50 flex items-center justify-center text-[var(--text-main)] tap"
        >
          <Menu size={17} />
        </button>
      </div>

      {openMobile && (
        <div className="md:hidden mt-3 border-t border-orange-200/40 pt-3 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--text-main)] font-medium">{user?.name}</p>
              <p className="text-xs text-[var(--text-soft)] capitalize -mt-1">{user?.role}</p>
            </div>
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-xl glass flex items-center justify-center text-[var(--text-main)] tap"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {links.map(({ path, label, icon: Icon }) => (
              <button
                key={path}
                onClick={() => {
                  navigate(path);
                  setOpenMobile(false);
                }}
                className={`flex flex-col items-center justify-center gap-1 px-2 py-2.5 rounded-xl text-xs tap ${
                  location.pathname === path
                    ? 'bg-orange-400/15 text-[var(--text-main)] border border-orange-300/40'
                    : 'glass text-[var(--text-soft)]'
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>
          <button
            onClick={handleLogout}
            className="w-full py-2 rounded-xl border border-rose-300/40 text-rose-600 tap"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}