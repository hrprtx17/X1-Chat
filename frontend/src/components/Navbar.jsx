import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Ticket, LayoutDashboard, LogOut, Zap } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
    <nav className="glass border-b border-[#00D97E]/10 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/chat')}>
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <Zap size={16} className="text-dark" />
        </div>
        <span className="font-bold text-white text-lg">X1Chat</span>
      </div>

      <div className="flex items-center gap-1">
        {links.map(({ path, label, icon: Icon }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              location.pathname === path
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-white">{user?.name}</p>
          <p className="text-xs text-gray-500">{user?.role}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
        >
          <LogOut size={15} />
          Logout
        </button>
      </div>
    </nav>
  );
}