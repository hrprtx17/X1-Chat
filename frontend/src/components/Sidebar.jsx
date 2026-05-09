import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Ticket,
  MessageSquare,
  HelpCircle,
  Settings,
  LogOut,
  Moon,
  Sun,
  Menu,
  X as CloseIcon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ isDark, toggleTheme, isMobileOpen, setMobileOpen }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', adminOnly: true },
    { label: 'Tickets', icon: Ticket, path: '/tickets', adminOnly: false },
    { label: 'AI Chatbot', icon: MessageSquare, path: '/chat', adminOnly: false },
    { label: 'FAQ', icon: HelpCircle, path: '/faqs', adminOnly: true },
    { label: 'Settings', icon: Settings, path: '/settings', adminOnly: false }
  ];

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  const handleNavClick = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarContent = (
    <>
      {/* Top Section */}
      <div className="p-4 border-b border-orange-200 dark:border-orange-900/30">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center text-white font-bold text-lg">
            X
          </div>
          <span className="font-bold text-gray-900 dark:text-white text-base">X1Chat</span>
        </div>

        {/* Workspace Name */}
        <p className="text-xs text-gray-500 dark:text-gray-400">Your Workspace</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-2">
        {navItems
          .filter((item) => !item.adminOnly || isAdmin)
          .map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all text-sm font-medium h-10 ${
                  isActive
                    ? isDark
                      ? 'bg-orange-900/30 text-orange-400 border-l-4 border-orange-500'
                      : 'bg-orange-50 text-orange-600 border-l-4 border-orange-500'
                    : isDark
                    ? 'text-gray-400 hover:bg-gray-900/40'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-gray-200 dark:border-gray-800 p-3 space-y-3">
        {/* User Profile */}
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
            {getInitials(user?.name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {user?.name || 'User'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user?.email || 'user@example.com'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 px-2 py-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex-1 flex items-center justify-center p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex-1 flex items-center justify-center p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-60 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 flex-col h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile Menu Button & Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 w-60 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 flex flex-col h-screen z-50 md:hidden transition-transform ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
