import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bell, Palette, Lock, AlertTriangle, LogOut, Copy, Check, User } from 'lucide-react';

export default function Settings({ isDark, toggleTheme }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    emailMarketing: false,
    pushNotifications: true,
    smsNotifications: false
  });

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

  const handleCopyEmail = () => {
    const email = user?.email ?? '';
    if (email) {
      navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLogoutClick = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-4xl section-spacing fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold">Settings</h1>
        <p className="text-gray-500 mt-1 font-medium">Manage your account preferences and security.</p>
      </div>

      {/* Profile Section */}
      <div className="card">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30">
           <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">Account Profile</h2>
        </div>
        <div className="p-8 flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="relative group">
            <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-3xl shadow-inner border border-primary/20">
              {getInitials(user?.name)}
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 flex items-center justify-center text-gray-400">
               <User size={16} />
            </div>
          </div>
          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Full Name</label>
              <p className="text-xl font-extrabold text-gray-900 dark:text-white">{user?.name ?? 'User'}</p>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Email Address</label>
              <div className="flex items-center justify-center md:justify-start gap-2 group/email">
                <p className="text-gray-700 dark:text-gray-300 font-semibold">{user?.email ?? 'No email'}</p>
                <button
                  onClick={handleCopyEmail}
                  className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-md transition-all opacity-0 group-hover/email:opacity-100"
                  title="Copy email"
                >
                  {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                </button>
              </div>
            </div>
            <div className="pt-2">
               <span className="badge bg-primary/10 text-primary border border-primary/20">{user?.role}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Notifications */}
        <div className="card flex flex-col">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
            <Bell size={16} className="text-primary" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900 dark:text-white">Notifications</h2>
          </div>
          <div className="p-6 space-y-4 flex-1">
            {[
              { key: 'emailUpdates', label: 'Email updates', description: 'Account & support activity' },
              { key: 'emailMarketing', label: 'Marketing', description: 'News and special offers' },
              { key: 'pushNotifications', label: 'Push', description: 'Real-time device alerts' }
            ].map(({ key, label, description }) => (
              <div key={key} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{label}</p>
                  <p className="text-xs text-gray-500 font-medium">{description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications[key] ?? false}
                    onChange={() => handleNotificationChange(key)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Appearance */}
        <div className="card flex flex-col">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
            <Palette size={16} className="text-primary" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900 dark:text-white">Appearance</h2>
          </div>
          <div className="p-6 flex-1 flex flex-col justify-center">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">Dark Mode</p>
                <p className="text-xs text-gray-500 font-medium">Switch to the dark side</p>
              </div>
              <button
                onClick={toggleTheme}
                className={`w-12 h-6 rounded-full transition-all relative ${
                  isDark ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${
                    isDark ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>
            <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Theme Preview</p>
               <div className="flex gap-2">
                  <div className="w-full h-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm" />
                  <div className="w-full h-8 bg-primary rounded-md shadow-sm" />
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card border-red-100 dark:border-red-900/30 bg-red-50/10">
        <div className="px-6 py-4 border-b border-red-50 dark:border-red-900/20 flex items-center gap-2">
          <AlertTriangle size={16} className="text-red-500" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-red-600 dark:text-red-400">Danger Zone</h2>
        </div>
        <div className="p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <p className="text-base font-bold text-gray-900 dark:text-white">Delete Account</p>
            <p className="text-sm text-gray-500 font-medium mt-1">Once you delete your account, there is no going back. Please be certain.</p>
          </div>
          <button
            type="button"
            disabled
            className="px-6 py-2.5 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed whitespace-nowrap"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Logout */}
      <div className="flex justify-center pt-8">
        <button
          onClick={handleLogoutClick}
          className="flex items-center gap-2 px-8 py-3 bg-gray-900 text-white dark:bg-white dark:text-gray-900 font-bold rounded-xl hover:opacity-90 transition-all active:scale-95 shadow-xl shadow-gray-900/10"
        >
          <LogOut size={18} />
          Sign Out of Account
        </button>
      </div>
    </div>
  );
}
