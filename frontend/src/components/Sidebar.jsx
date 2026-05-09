import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Ticket,
  MessageSquare,
  HelpCircle,
  Settings,
  LogOut,
  Moon,
  Sun
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ isDark, toggleTheme, isMobileOpen, setMobileOpen }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';

  // Strictly filter navigation items based on role
  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', adminOnly: true },
    { label: 'Tickets', icon: Ticket, path: '/tickets', adminOnly: false },
    { label: 'AI Chatbot', icon: MessageSquare, path: '/chat', adminOnly: false },
    { label: 'FAQ', icon: HelpCircle, path: '/faqs', adminOnly: true },
    { label: 'Settings', icon: Settings, path: '/settings', adminOnly: false }
  ].filter(item => !item.adminOnly || isAdmin);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .filter(Boolean)
      .map((n) => n?.[0] ?? '')
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleNavClick = (path) => {
    navigate(path);
    if (setMobileOpen) setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      {/* Top Section */}
      <div className="p-6 flex items-center gap-3 mb-2">
        <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-lg shadow-primary/20">
          X1
        </div>
        <span className="font-bold text-gray-900 dark:text-white text-xl tracking-tight">X1Chat</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => handleNavClick(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-semibold group ${
                isActive
                  ? 'bg-primary/5 text-primary dark:bg-primary/10'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-white'
              }`}
            >
              <Icon size={18} className={`transition-colors ${isActive ? 'text-primary' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 space-y-4 bg-gray-50/30 dark:bg-gray-900/30">
        {/* User Profile */}
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="w-10 h-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0 border border-primary/20">
            {getInitials(user?.name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900 dark:text-white truncate leading-tight">
              {user?.name ?? 'User'}
            </p>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider truncate">
              {user?.role ?? 'Member'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 px-1">
          <button
            onClick={toggleTheme}
            className="flex-1 flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-white dark:hover:bg-gray-800 transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-700 shadow-sm"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <button
            onClick={handleLogout}
            className="flex-1 flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all border border-transparent hover:border-red-100 dark:hover:border-red-900/30 shadow-sm"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-[240px] flex-shrink-0 h-screen sticky top-0 z-20">
        {sidebarContent}
      </aside>

      {/* Mobile Menu Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-gray-900/40 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setMobileOpen && setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 w-[260px] h-screen z-50 md:hidden transition-transform duration-300 ease-out shadow-2xl ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
