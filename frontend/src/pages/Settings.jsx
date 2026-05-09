import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Bell, Palette, Lock, AlertTriangle, LogOut, Copy, Check, 
  User, Moon, Sun, Shield, Settings as SettingsIcon,
  Mail, ExternalLink, Globe, Zap, Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.38, delay, ease: [0.22, 1, 0.36, 1] },
});

const sectionTransition = {
  initial: { opacity: 0, x: 10 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -10 },
  transition: { duration: 0.25, ease: 'easeInOut' }
};

function Toggle({ checked, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
      <div className="flex-1 pr-4">
        <p className="text-sm font-bold text-gray-900 dark:text-white">{label}</p>
        {description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{description}</p>}
      </div>
      <button
        type="button"
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
          checked ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}

export default function Settings({ isDark, toggleTheme }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [copied, setCopied] = useState(false);
  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    emailMarketing: false,
    pushNotifications: true,
  });

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').filter(Boolean).map((n) => n?.[0] ?? '').join('').toUpperCase().slice(0, 2);
  };

  const handleCopyEmail = () => {
    const email = user?.email ?? '';
    if (email) {
      navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const toggleNotification = (key) => setNotifications((p) => ({ ...p, [key]: !p[key] }));

  const handleLogout = () => { logout(); navigate('/login'); };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  const currentTabLabel = useMemo(() => tabs.find(t => t.id === activeTab)?.label, [activeTab]);

  return (
    <div className="max-w-5xl mx-auto pb-20">
      {/* Header Section */}
      <div className="mb-10 mt-2">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <SettingsIcon size={20} className="text-primary" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Account Settings</h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400 font-medium ml-13">
          Manage your account settings and set your e-mail preferences.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-64 flex flex-row lg:flex-col gap-1 p-1 bg-gray-100/50 dark:bg-gray-800/40 rounded-2xl border border-gray-200/50 dark:border-gray-700/30 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 whitespace-nowrap flex-1 lg:flex-none ${
                  isActive 
                    ? 'text-primary bg-white dark:bg-gray-900 shadow-sm' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-primary' : 'text-gray-400'} />
                {tab.label}
                {isActive && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-xl border-2 border-primary/20 pointer-events-none"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            );
          })}
          
          <div className="lg:mt-4 lg:pt-4 lg:border-t border-gray-200 dark:border-gray-700/50 hidden lg:block">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 w-full min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              {...sectionTransition}
              className="space-y-6"
            >
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  {/* Profile Header Card */}
                  <div className="card-hover relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary/10 via-orange-400/5 to-transparent dark:from-primary/20" />
                    <div className="p-8 relative pt-12">
                      <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
                        <div className="relative">
                          <div className="w-24 h-24 rounded-3xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary font-black text-3xl border-4 border-white dark:border-gray-900 shadow-xl group-hover:scale-105 transition-transform duration-500">
                            {getInitials(user?.name)}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-white border-4 border-white dark:border-gray-900 shadow-lg">
                            <Zap size={14} fill="currentColor" />
                          </div>
                        </div>
                        <div className="flex-1 text-center md:text-left mb-2">
                          <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{user?.name ?? 'User'}</h2>
                          <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
                            <span className="badge bg-primary/10 text-primary border border-primary/20 text-[10px] uppercase tracking-widest">
                              {user?.role ?? 'member'}
                            </span>
                            <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Personal Account</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Account Details */}
                  <div className="card p-8">
                    <h3 className="section-title mb-6 flex items-center gap-2">
                      <Globe size={14} /> Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-1.5">
                        <label className="label">Full Name</label>
                        <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-200/50 dark:border-gray-700/30 group-focus-within:border-primary/50 transition-all">
                          <User size={18} className="text-gray-400" />
                          <input 
                            type="text" 
                            readOnly 
                            value={user?.name ?? ''} 
                            className="bg-transparent border-none p-0 focus:ring-0 text-sm font-bold text-gray-900 dark:text-white w-full"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="label">Email Address</label>
                        <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-200/50 dark:border-gray-700/30">
                          <Mail size={18} className="text-gray-400" />
                          <input 
                            type="text" 
                            readOnly 
                            value={user?.email ?? ''} 
                            className="bg-transparent border-none p-0 focus:ring-0 text-sm font-bold text-gray-700 dark:text-gray-400 w-full"
                          />
                          <button
                            onClick={handleCopyEmail}
                            className="p-1.5 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-all text-gray-400 hover:text-primary"
                          >
                            {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
                      <div className="flex items-start gap-4 p-4 rounded-2xl bg-blue-50/30 dark:bg-blue-900/10 border border-blue-100/50 dark:border-blue-900/20">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                          <Shield size={18} className="text-blue-500" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">Enterprise Verified</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                            Your account is secured with end-to-end encryption and MFA. Some fields are locked by your organization.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div className="card p-8">
                    <h3 className="section-title mb-8 flex items-center gap-2">
                      <Bell size={14} /> Email & Push Preferences
                    </h3>
                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                      <Toggle 
                        checked={notifications.emailUpdates} 
                        onChange={() => toggleNotification('emailUpdates')}
                        label="Product Updates"
                        description="Receive emails about new features, improvements, and system updates."
                      />
                      <Toggle 
                        checked={notifications.emailMarketing} 
                        onChange={() => toggleNotification('emailMarketing')}
                        label="Marketing Communications"
                        description="Periodic news, special offers and tips for getting the most out of X1Chat."
                      />
                      <Toggle 
                        checked={notifications.pushNotifications} 
                        onChange={() => toggleNotification('pushNotifications')}
                        label="Desktop Notifications"
                        description="Show desktop alerts for new messages, ticket replies, and mentions."
                      />
                    </div>
                  </div>

                  <div className="card p-6 bg-primary/[0.02] border-primary/10">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                        <Zap size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">Real-time Sync Active</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Changes are synced across all your active devices automatically.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Appearance Tab */}
              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <div className="card p-8">
                    <h3 className="section-title mb-8 flex items-center gap-2">
                      <Palette size={14} /> Interface Customization
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <Toggle 
                          checked={isDark} 
                          onChange={toggleTheme}
                          label="Dark Mode"
                          description="Lower eye strain in low-light environments."
                        />
                        
                        <div className="pt-4 space-y-4">
                          <label className="label">Theme Colors</label>
                          <div className="flex gap-3">
                            {['#F97316', '#3B82F6', '#10B981', '#8B5CF6'].map((color, idx) => (
                              <button 
                                key={color}
                                className={`w-10 h-10 rounded-xl border-4 ${idx === 0 ? 'border-primary/30 ring-2 ring-primary/20' : 'border-transparent'}`}
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="label">Live Preview</label>
                        <div className={`p-6 rounded-3xl border shadow-2xl transition-all duration-500 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 rounded-lg bg-primary" />
                            <div className={`h-3 w-24 rounded-full ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`} />
                          </div>
                          <div className="space-y-3">
                            <div className={`h-12 w-full rounded-2xl ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`} />
                            <div className={`h-12 w-full rounded-2xl ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`} />
                            <div className="h-10 w-24 rounded-xl bg-primary mt-2" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div className="card p-8">
                    <h3 className="section-title mb-8 flex items-center gap-2">
                      <Lock size={14} /> Password & Security
                    </h3>
                    
                    <div className="space-y-8">
                      <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800/50">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center text-gray-400 shadow-sm">
                            <Lock size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">Account Password</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Last updated: 3 months ago</p>
                          </div>
                        </div>
                        <button disabled className="btn-secondary px-6 py-3 text-xs opacity-50 cursor-not-allowed">
                          Change Password
                        </button>
                      </div>

                      <div className="p-6 border border-amber-100 dark:border-amber-900/30 bg-amber-50/30 dark:bg-amber-900/5 rounded-2xl">
                        <div className="flex items-start gap-4">
                          <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={18} />
                          <div>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">Two-Factor Authentication</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                              Add an extra layer of security to your account. This feature is managed by your administrator.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div className="card border-red-100 dark:border-red-900/30 overflow-hidden">
                    <div className="px-8 py-4 bg-red-50/50 dark:bg-red-950/10 border-b border-red-100 dark:border-red-900/20 flex items-center justify-between">
                      <h3 className="text-xs font-bold text-red-500 uppercase tracking-widest flex items-center gap-2">
                        <AlertTriangle size={14} /> Critical Actions
                      </h3>
                    </div>
                    <div className="p-8 space-y-6">
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="max-w-md">
                          <p className="text-sm font-bold text-gray-900 dark:text-white">Delete Account Permanentally</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">
                            Once deleted, your account cannot be recovered. All tickets, chats, and personal data will be erased from our servers within 30 days.
                          </p>
                        </div>
                        <button 
                          disabled 
                          className="px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-xl shadow-red-500/20"
                        >
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer Info */}
      <motion.div {...fadeUp(0.4)} className="mt-20 pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6 opacity-60 hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-6">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">System Status: <span className="text-emerald-500">Operational</span></p>
          <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Version: 2.4.0-build.82</p>
        </div>
        <div className="flex items-center gap-5">
          <button className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-primary transition-colors">Privacy Policy</button>
          <button className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-primary transition-colors">Terms of Service</button>
          <button className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-1">
            API Documentation <ExternalLink size={10} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

