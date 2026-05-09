import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

export default function AppLayout({ children, isDark, toggleTheme }) {
  const [isMobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').filter(Boolean).map((n) => n?.[0] ?? '').join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="flex h-screen w-full bg-[var(--bg-alt)] overflow-hidden">
      <Sidebar
        isDark={isDark}
        toggleTheme={toggleTheme}
        isMobileOpen={isMobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Mobile Top Bar */}
        <div className="md:hidden bg-white dark:bg-[#0D0D10] border-b border-gray-100 dark:border-white/5 px-6 py-4 flex items-center justify-between z-40 flex-shrink-0 shadow-sm">
          <button
            onClick={() => setMobileOpen(!isMobileOpen)}
            className="p-2 -ml-2 text-gray-500 dark:text-gray-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
          >
            {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-white font-black text-xs shadow-lg shadow-primary/20">
              X1
            </div>
            <span className="font-black text-gray-900 dark:text-white text-sm tracking-tight uppercase">X1-Chat</span>
          </div>

          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-[10px] border border-primary/20">
            {getInitials(user?.name)}
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-[var(--bg-alt)] flex flex-col relative custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="page-container flex-1 flex flex-col min-h-0"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
