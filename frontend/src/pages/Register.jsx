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
    if (!name || !email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const data = await register(name, email, password);
      toast.success(`Welcome to the team, ${name}!`);
      
      // Navigate based on role (returned from register call)
      if (data?.user?.role === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/chat');
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#FAFAFA] dark:bg-gray-950 transition-colors">
      {/* Left Side: Visual */}
      <div className="hidden lg:flex relative w-0 flex-1 bg-gray-900 overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-700 to-primary-500 opacity-95" />
        
        {/* Background Patterns */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(45deg, white 25%, transparent 25%, transparent 50%, white 50%, white 75%, transparent 75%, transparent)', backgroundSize: '40px 40px' }} />
        
        <div className="relative z-10 max-w-xl px-12 text-white">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-6xl font-black mb-8 leading-[1.1] tracking-tighter">
              Start scaling <br />
              your support <br />
              <span className="text-primary-200">today.</span>
            </h3>
            
            <div className="space-y-6 mt-12">
               {[
                 { title: 'AI-Powered Resolution', desc: 'Auto-resolve up to 40% of common queries instantly.' },
                 { title: 'Unified Omnichannel', desc: 'Email, Chat, and Social in one clean interface.' },
                 { title: 'Enterprise Security', desc: 'AES-256 encryption and SOC2 compliant infrastructure.' }
               ].map((item, i) => (
                 <div key={i} className="flex gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10 group">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                       <CheckCircle2 size={20} />
                    </div>
                    <div>
                       <p className="font-bold text-lg">{item.title}</p>
                       <p className="text-sm opacity-70 font-medium">{item.desc}</p>
                    </div>
                 </div>
               ))}
            </div>

            <div className="mt-16 pt-8 border-t border-white/10">
               <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                     {[1,2,3,4].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-primary-600 bg-gray-200" />
                     ))}
                  </div>
                  <p className="text-sm font-bold tracking-tight">Join 1,200+ teams worldwide</p>
               </div>
            </div>
          </motion.div>
        </div>

        {/* Decorative Blur */}
        <div className="absolute top-1/4 -right-24 w-96 h-96 bg-primary-400/20 rounded-full blur-[120px]" />
      </div>

      {/* Right Side: Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-16 xl:px-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto w-full max-w-sm lg:w-[440px] bg-white dark:bg-gray-900 p-8 sm:p-12 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800"
        >
          <div className="flex items-center gap-2 mb-10">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20">
              X1
            </div>
            <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">X1Chat</span>
          </div>

          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Create Account</h2>
          <p className="mt-3 text-sm text-gray-500 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:text-primary-600 font-bold transition-colors">
              Sign in instead
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="mt-10 space-y-5">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field pl-11 py-3.5 bg-gray-50/50 border-gray-200 dark:bg-gray-800 dark:border-gray-700"
                  placeholder="Jane Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Work Email</label>
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
                  placeholder="jane@company.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
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
                  placeholder="Minimum 8 characters"
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
              className="w-full btn-primary py-4 text-base font-bold shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed group mt-2"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  Get Started Free
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-[11px] text-gray-400 font-medium leading-relaxed">
            By signing up, you agree to our <Link to="#" className="text-gray-600 dark:text-gray-200 underline">Terms of Service</Link> and <Link to="#" className="text-gray-600 dark:text-gray-200 underline">Privacy Policy</Link>.
          </p>
        </motion.div>
      </div>
    </div>
  );
}