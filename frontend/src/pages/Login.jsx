import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Mail, Lock, ArrowRight, Eye, EyeOff, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import API from '../utils/axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Please fill in all fields'); return; }
    setLoading(true);
    try {
      const data = await login(email, password);
      toast.success('Welcome back!');
      navigate(data.user.role === 'admin' ? '/dashboard' : '/chat');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#FAFAFA] dark:bg-[#080809]">
      {/* Form Side */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-20 xl:px-28 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22,1,0.36,1] }}
          className="mx-auto w-full max-w-sm"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 mb-10">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-orange-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-primary/30">
              X1
            </div>
            <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">X1Chat</span>
          </Link>

          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            New here?{' '}
            <Link to="/register" className="text-primary hover:text-primary-600 font-bold transition-colors">
              Create a free account →
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="mt-9 space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="label">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                <input
                  type="email" required value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-11"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="label">Password</label>
                <Link to="#" className="text-[11px] font-bold text-primary hover:text-primary-600 uppercase tracking-wider transition-colors">
                  Forgot?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'} required value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-11 pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full btn-primary py-3.5 text-sm font-bold"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Sign In <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </form>

          <div className="mt-8 p-4 bg-primary/5 dark:bg-primary/8 border border-primary/10 rounded-2xl flex items-start gap-3">
            <ShieldCheck className="text-primary shrink-0 mt-0.5" size={18} />
            <p className="text-xs text-primary/80 dark:text-primary/90 font-medium leading-relaxed">
              Protected by X1 Enterprise-grade security. All data is encrypted in transit and at rest.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Visual Side */}
      <div className="hidden lg:flex relative w-0 flex-1 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a0800] via-[#0f0500] to-[#080400]" />
        <div className="absolute inset-0 hero-grid opacity-40" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-primary/20 blur-[100px]" />

        <div className="relative z-10 flex flex-col justify-center px-14 max-w-lg">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22,1,0.36,1] }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/8 border border-white/15 rounded-full text-xs font-bold text-white/80 uppercase tracking-widest mb-8">
              <Zap size={12} className="text-primary" />
              Next-Gen Support Platform
            </div>
            <h3 className="text-5xl font-black text-white leading-[1.1] tracking-tight mb-8">
              The platform built for{' '}
              <span className="gradient-text">speed.</span>
            </h3>

            <div className="p-7 glass rounded-2xl border border-white/10">
              <p className="text-base text-white/80 italic leading-relaxed mb-5">
                "X1Chat cut our first-response time from 4 hours to under 8 minutes. Our customers noticed immediately."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/30 border border-primary/40 flex items-center justify-center font-bold text-white text-sm">
                  SK
                </div>
                <div>
                  <p className="font-bold text-white text-sm">Sarah Kim</p>
                  <p className="text-xs text-white/50">Head of Support, Skyline</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-4 text-white/30">
              <span className="text-xs font-bold uppercase tracking-widest">Trusted by</span>
              <div className="h-px flex-1 bg-white/10" />
              <div className="flex gap-5 text-white/40 font-black text-sm tracking-tighter italic">
                <span>SKYLINE</span><span>VOX</span><span>APEX</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}