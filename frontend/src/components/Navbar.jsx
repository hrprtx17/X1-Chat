import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Ticket, LayoutDashboard, LogOut, Zap, Menu } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [openMobile, setOpenMobile] = useState(false);

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
    <nav className="glass border-b border-white/10 px-4 md:px-6 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <button className="flex items-center gap-3" onClick={() => navigate('/chat')}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-300 to-emerald-200 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Zap size={16} className="text-slate-900" />
          </div>
          <span className="font-semibold tracking-tight text-white text-lg">X1Chat</span>
        </button>

        <div className="hidden md:flex items-center gap-1 p-1 rounded-xl border border-white/10 bg-white/[0.02]">
          {links.map(({ path, label, icon: Icon }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                location.pathname === path
                  ? 'bg-indigo-400/20 text-indigo-100 border border-indigo-200/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-white">{user?.name}</p>
            <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-rose-300 hover:text-rose-200 hover:bg-rose-500/10 transition-all border border-rose-300/20"
          >
            <LogOut size={15} />
            Logout
          </button>
        </div>

        <button
          onClick={() => setOpenMobile(!openMobile)}
          className="md:hidden w-9 h-9 rounded-xl border border-white/15 flex items-center justify-center text-slate-200"
        >
          <Menu size={17} />
        </button>
      </div>

      {openMobile && (
        <div className="md:hidden mt-3 border-t border-white/10 pt-3 space-y-2">
          <p className="text-sm text-white font-medium">{user?.name}</p>
          <p className="text-xs text-slate-400 capitalize -mt-1">{user?.role}</p>
          <div className="grid grid-cols-3 gap-2">
            {links.map(({ path, label, icon: Icon }) => (
              <button
                key={path}
                onClick={() => {
                  navigate(path);
                  setOpenMobile(false);
                }}
                className={`flex flex-col items-center justify-center gap-1 px-2 py-2.5 rounded-xl text-xs ${
                  location.pathname === path
                    ? 'bg-indigo-400/20 text-indigo-100 border border-indigo-200/20'
                    : 'glass text-slate-300'
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>
          <button
            onClick={handleLogout}
            className="w-full py-2 rounded-xl border border-rose-300/30 text-rose-300"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}