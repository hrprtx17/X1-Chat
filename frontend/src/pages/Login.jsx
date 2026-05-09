import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Mail, Lock, ArrowRight, Eye, EyeOff, ShieldCheck, Sparkles } from 'lucide-react';
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
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', { email, password });
      
      if (data?.user && data?.token) {
        login(data.user, data.token);
        toast.success('Welcome back to X1Chat!');
        
        if (data.user.role === 'admin') {
          navigate('/dashboard');
        } else {
          navigate('/chat');
        }
      } else {
        throw new Error('Invalid server response');
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#FAFAFA] dark:bg-gray-950 transition-colors">
      {/* Left Side: Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-16 xl:px-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto w-full max-w-sm lg:w-[420px] bg-white dark:bg-gray-900 p-8 sm:p-12 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800"
        >
          <div className="flex items-center gap-2 mb-10">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20">
              X1
            </div>
            <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">X1Chat</span>
          </div>

          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Welcome Back</h2>
          <p className="mt-3 text-sm text-gray-500 font-medium">
            New here?{' '}
            <Link to="/register" className="text-primary hover:text-primary-600 font-bold transition-colors">
              Create an account
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="mt-10 space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-11 py-3.5 bg-gray-50/50 border-gray-200 dark:bg-gray-800 dark:border-gray-700"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Password</label>
                <Link to="#" className="text-[11px] font-bold text-primary hover:text-primary-600 uppercase tracking-widest">Forgot?</Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-11 pr-12 py-3.5 bg-gray-50/50 border-gray-200 dark:bg-gray-800 dark:border-gray-700"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-4 text-base font-bold shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  Sign In
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </button>
          </form>

          <div className="mt-10 flex items-center gap-4 py-4 px-6 bg-primary/5 dark:bg-primary/10 rounded-2xl border border-primary/10">
            <ShieldCheck className="text-primary shrink-0" size={24} />
            <p className="text-xs font-semibold text-primary/80 dark:text-primary/90 leading-snug">
              Secure authentication powered by X1 Enterprise. Your data is always encrypted.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right Side: Visual */}
      <div className="hidden lg:flex relative w-0 flex-1 bg-gray-900 overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-900 opacity-90" />
        
        {/* Background Patterns */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        
        <div className="relative z-10 max-w-xl px-12 text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-xs font-bold uppercase tracking-widest mb-8">
              <Sparkles size={14} className="text-primary-300" />
              Next-Gen Customer Support
            </div>
            <h3 className="text-6xl font-black mb-8 leading-[1.1] tracking-tighter">
              The platform built for <span className="text-primary-300 italic">speed.</span>
            </h3>
            
            <div className="space-y-8">
               <div className="p-8 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl">
                  <p className="text-xl font-medium leading-relaxed italic opacity-90">
                    "X1Chat has completely transformed how we handle customer requests. Our resolution time dropped by 65% in the first month."
                  </p>
                  <div className="mt-6 flex items-center gap-4">
                     <div className="w-12 h-12 rounded-full bg-primary-400 flex items-center justify-center font-bold text-lg">M</div>
                     <div>
                        <p className="font-bold">Marcus Chen</p>
                        <p className="text-sm opacity-60">Director of Ops, TechFlow</p>
                     </div>
                  </div>
               </div>
               
               <div className="flex items-center gap-12 opacity-50">
                  <div className="text-sm font-bold tracking-widest uppercase">Trusted by</div>
                  <div className="h-6 w-px bg-white/20" />
                  <div className="flex gap-8 font-black text-xl italic tracking-tighter">
                     <span>SKYLINE</span>
                     <span>VOX</span>
                     <span>APEX</span>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>

        {/* Decorative Circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-500/20 rounded-full blur-[100px]" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary-700/20 rounded-full blur-[100px]" />
      </div>
    </div>
  );
}