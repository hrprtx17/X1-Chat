import { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';

export default function AppLayout({ children, isDark, toggleTheme }) {
  const [isMobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={`flex h-screen w-full bg-white dark:bg-gray-950`}>
      {/* Sidebar */}
      <Sidebar
        isDark={isDark}
        toggleTheme={toggleTheme}
        isMobileOpen={isMobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F9FAFB] dark:bg-gray-950 h-screen overflow-hidden">
        {/* Mobile Top Bar */}
        <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between z-10 flex-shrink-0">
          <button
            onClick={() => setMobileOpen(!isMobileOpen)}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <Menu size={24} />
          </button>

          {/* Mobile Logo */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-white font-bold text-xs">
              X1
            </div>
            <span className="font-semibold text-gray-900 dark:text-white">X1Chat</span>
          </div>

          {/* Mobile User Avatar */}
          <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-medium text-xs flex-shrink-0 border border-primary-200 dark:border-primary-800/50">
            {getInitials(user?.name)}
          </div>
        </div>

        {/* Scrollable Main Content Area */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
