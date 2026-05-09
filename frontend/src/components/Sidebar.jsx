import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Ticket, MessageSquare,
  HelpCircle, Settings, LogOut, Moon, Sun, 
  ChevronRight, ChevronLeft, User, Zap, Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const sidebarVariants = {
  expanded: { width: 280, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  collapsed: { width: 88, transition: { type: 'spring', stiffness: 300, damping: 30 } }
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 }
};

const Tooltip = ({ text, children }) => (
  <div className="group relative">
    {children}
    <div className="absolute left-full ml-3 px-3 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all pointer-events-none whitespace-nowrap shadow-xl z-50">
      {text}
      <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900 dark:bg-white rotate-45" />
    </div>
  </div>
);

export default function Sidebar({ isDark, toggleTheme, isMobileOpen, setMobileOpen }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', isCollapsed);
  }, [isCollapsed]);

  const navItems = useMemo(() => [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', adminOnly: true, color: 'text-blue-500' },
    { label: 'Tickets', icon: Ticket, path: '/tickets', adminOnly: false, color: 'text-emerald-500' },
    { label: 'X1 Chat', icon: MessageSquare, path: '/chat', adminOnly: false, color: 'text-purple-500' },
    { label: 'FAQ', icon: HelpCircle, path: '/faqs', adminOnly: true, color: 'text-amber-500' },
    { label: 'Settings', icon: Settings, path: '/settings', adminOnly: false, color: 'text-gray-500' },
  ].filter((item) => !item.adminOnly || isAdmin), [isAdmin]);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').filter(Boolean).map((n) => n?.[0] ?? '').join('').toUpperCase().slice(0, 2);
  };

  const handleNavClick = (path) => {
    navigate(path);
    if (setMobileOpen) setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const SidebarContent = ({ collapsed = false }) => (
    <div className={`flex flex-col h-full glass-card border-r-0 rounded-none relative overflow-hidden`}>
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[60px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/5 blur-[60px] pointer-events-none" />

      {/* Header / Logo */}
      <div className={`px-6 py-8 flex items-center transition-all duration-300 ${collapsed ? 'justify-center' : 'justify-between'}`}>
        <div className="flex items-center gap-4">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 bg-gradient-to-br from-primary to-orange-600 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-lg shadow-primary/25 shrink-0 cursor-pointer"
            onClick={() => navigate('/')}
          >
            X1
          </motion.div>
          {!collapsed && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col"
            >
              <span className="font-black text-gray-900 dark:text-white text-lg tracking-tighter leading-none">X1 Chat</span>
              <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mt-1.5 flex items-center gap-1">
                {isAdmin ? <Zap size={10} className="text-primary fill-current" /> : <Sparkles size={10} className="text-emerald-500 fill-current" />}
                {isAdmin ? 'Enterprise' : 'Personal'}
              </span>
            </motion.div>
          )}
        </div>
      </div>


      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto no-scrollbar py-4">
        {!collapsed && (
          <p className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.2em] px-3 pb-3">
            Main Menu
          </p>
        )}
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          const buttonContent = (
            <button
              key={item.path}
              onClick={() => handleNavClick(item.path)}
              className={`relative w-full flex items-center transition-all duration-300 rounded-2xl group ${
                collapsed ? 'justify-center p-3.5' : 'gap-4 px-4 py-3.5'
              } ${isActive ? 'bg-primary/10 shadow-[0_0_0_1px_rgba(249,115,22,0.1)]' : 'hover:bg-gray-50 dark:hover:bg-gray-800/40'}`}
            >
              {isActive && (
                <motion.div 
                  layoutId="active-indicator"
                  className="absolute left-0 w-1.5 h-6 bg-primary rounded-r-full shadow-[0_0_15px_rgba(249,115,22,0.5)]"
                />
              )}
              <Icon
                size={collapsed ? 20 : 18}
                className={`shrink-0 transition-all duration-300 ${
                  isActive ? 'text-primary scale-110' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white group-hover:scale-110'
                }`}
              />
              {!collapsed && (
                <span className={`text-sm font-bold tracking-tight transition-colors ${
                  isActive ? 'text-primary' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
                }`}>
                  {item.label}
                </span>
              )}
              {!collapsed && isActive && (
                <motion.div initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="ml-auto">
                   <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-ring" />
                </motion.div>
              )}
            </button>
          );

          return collapsed ? (
            <Tooltip key={item.path} text={item.label}>
              {buttonContent}
            </Tooltip>
          ) : buttonContent;
        })}

      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-100/50 dark:border-gray-800/50 space-y-4">
        {/* Appearance & Logout Mini Actions */}
        <div className={`flex items-center gap-2 ${collapsed ? 'flex-col' : 'px-2'}`}>
          <button
            onClick={toggleTheme}
            className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 group ${collapsed ? 'w-full' : ''}`}
            title={isDark ? 'Switch to Light' : 'Switch to Dark'}
          >
            {isDark ? <Sun size={16} className="text-amber-500 group-hover:rotate-45 transition-transform" /> : <Moon size={16} className="text-gray-400 group-hover:-rotate-12 transition-transform" />}
            {!collapsed && <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Theme</span>}
          </button>
          <button
            onClick={handleLogout}
            className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl transition-all border border-transparent hover:border-red-100 dark:hover:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/20 group ${collapsed ? 'w-full' : ''}`}
            title="Sign Out"
          >
            <LogOut size={16} className="text-gray-400 group-hover:text-red-500 transition-colors" />
            {!collapsed && <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest group-hover:text-red-500">Logout</span>}
          </button>
        </div>

        {/* User Profile */}
        <div className={`flex items-center transition-all duration-300 p-2 rounded-2xl bg-gray-50/50 dark:bg-gray-800/20 border border-transparent hover:border-gray-200/50 dark:hover:border-gray-700/50 cursor-pointer group ${collapsed ? 'justify-center p-2' : 'gap-3 px-3 py-3'}`}>
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-xl bg-primary text-white font-black text-xs flex items-center justify-center shadow-lg shadow-primary/20 ring-2 ring-white dark:ring-gray-900">
              {getInitials(user?.name)}
            </div>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-gray-900 rounded-full" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-gray-900 dark:text-white truncate leading-none mb-1">
                {user?.name ?? 'User'}
              </p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest truncate">
                {user?.role ?? 'Member'}
              </p>
            </div>
          )}
          {!collapsed && <ChevronRight size={14} className="text-gray-300 group-hover:text-primary transition-colors" />}
        </div>

        {/* Collapse Toggle (Desktop Only) */}
        <div className="hidden md:flex justify-center pt-2">
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-all shadow-sm"
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <motion.aside 
        initial={false}
        animate={isCollapsed ? 'collapsed' : 'expanded'}
        variants={sidebarVariants}
        className="hidden md:block h-screen sticky top-0 z-20 flex-shrink-0"
      >
        <SidebarContent collapsed={isCollapsed} />
      </motion.aside>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-[2px]"
            onClick={() => setMobileOpen?.(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isMobileOpen ? 0 : -300 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-0 left-0 w-[280px] h-screen z-50 md:hidden shadow-2xl"
      >
        <SidebarContent collapsed={false} />
      </motion.aside>
    </>
  );
}

