import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, CheckCircle2, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) { toast.error('Please fill in all fields'); return; }
    setLoading(true);
    try {
      const data = await register(name, email, password);
      toast.success(`Welcome, ${name}!`);
      navigate(data?.user?.role === 'admin' ? '/dashboard' : '/chat');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const perks = [
    { title: 'AI-Powered Resolution', desc: 'Auto-resolve up to 40% of common queries.' },
    { title: 'Unified Omnichannel', desc: 'Email, Chat & Social in one clean interface.' },
    { title: 'Enterprise Security', desc: 'AES-256 encryption, SOC2 compliant.' },
  ];

  return (
    <div className="min-h-screen flex bg-[#FAFAFA] dark:bg-[#080809]">
      {/* Visual Side */}
      <div className="hidden lg:flex relative w-0 flex-1 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a0800] via-[#0f0500] to-[#0a0300]" />
        <div className="absolute inset-0 hero-grid opacity-40" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-primary/20 blur-[120px]" />

        <div className="relative z-10 flex flex-col justify-center px-14 max-w-lg">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22,1,0.36,1] }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/8 border border-white/15 rounded-full text-xs font-bold text-white/80 uppercase tracking-widest mb-8">
              <Zap size={12} className="text-primary" />
              Start Free Today
            </div>
            <h3 className="text-5xl font-black text-white leading-[1.1] tracking-tight mb-10">
              Scale your support{' '}
              <span className="gradient-text">with AI.</span>
            </h3>

            <div className="space-y-4">
              {perks.map((perk, i) => (
                <motion.div
                  key={perk.title}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1, ease: [0.22,1,0.36,1] }}
                  className="flex gap-4 p-4 rounded-2xl glass border border-white/8 hover:border-white/16 transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{perk.title}</p>
                    <p className="text-xs text-white/50 mt-0.5">{perk.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 pt-8 border-t border-white/8 flex items-center gap-4">
              <div className="flex -space-x-2">
                {[1,2,3,4].map((i) => (
                  <div key={i} className="w-9 h-9 rounded-full border-2 border-[#1a0800] bg-primary/20 flex items-center justify-center text-white text-xs font-bold">
                    {['A','B','C','D'][i-1]}
                  </div>
                ))}
              </div>
              <p className="text-sm text-white/60 font-semibold">Join 1,200+ teams worldwide</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-20 xl:px-28 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22,1,0.36,1] }}
          className="mx-auto w-full max-w-sm"
        >
          <Link to="/" className="flex items-center gap-2.5 mb-10">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-orange-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-primary/30">
              X1
            </div>
            <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">X1Chat</span>
          </Link>

          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Create account</h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:text-primary-600 font-bold transition-colors">
              Sign in →
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="mt-9 space-y-4">
            {[
              { label: 'Full Name', icon: User, type: 'text', value: name, setter: setName, placeholder: 'Jane Doe' },
              { label: 'Work Email', icon: Mail, type: 'email', value: email, setter: setEmail, placeholder: 'jane@company.com' },
            ].map(({ label, icon: Icon, type, value, setter, placeholder }) => (
              <div key={label} className="space-y-1.5">
                <label className="label">{label}</label>
                <div className="relative group">
                  <Icon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                  <input
                    type={type} required value={value}
                    onChange={(e) => setter(e.target.value)}
                    className="input-field pl-11"
                    placeholder={placeholder}
                  />
                </div>
              </div>
            ))}

            <div className="space-y-1.5">
              <label className="label">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'} required value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-11 pr-12"
                  placeholder="Min. 8 characters"
                />
                <button
                  type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full btn-primary py-3.5 text-sm font-bold mt-2">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Get Started Free <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-400 leading-relaxed">
            By signing up, you agree to our{' '}
            <Link to="#" className="text-gray-600 dark:text-gray-300 underline hover:text-primary transition-colors">Terms</Link>
            {' '}and{' '}
            <Link to="#" className="text-gray-600 dark:text-gray-300 underline hover:text-primary transition-colors">Privacy Policy</Link>.
          </p>
        </motion.div>
      </div>
    </div>
  );
}