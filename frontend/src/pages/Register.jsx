import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, User, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../utils/axios';
import toast, { Toaster } from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/auth/register', form);
      login(data.user, data.token);
      toast.success('Account created!');
      navigate('/chat');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      <Toaster position="top-center" toastOptions={{ style: { background: '#0D0D14', color: '#fff', border: '1px solid rgba(0,217,126,0.2)' } }} />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-card p-8 glow-sm">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
              <Zap size={18} className="text-dark" />
            </div>
            <span className="font-bold text-white text-xl">X1Chat</span>
          </div>

          <h1 className="text-2xl font-bold text-white mb-1">Create account</h1>
          <p className="text-gray-500 mb-8 text-sm">Join X1Chat for free</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs text-gray-500 mb-2 block uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Harpreet Singh"
                  className="w-full glass rounded-xl px-4 py-3 pl-11 text-white placeholder-gray-600 focus:outline-none focus:border-primary/40 text-sm transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-2 block uppercase tracking-wider">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full glass rounded-xl px-4 py-3 pl-11 text-white placeholder-gray-600 focus:outline-none focus:border-primary/40 text-sm transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-2 block uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full glass rounded-xl px-4 py-3 pl-11 text-white placeholder-gray-600 focus:outline-none focus:border-primary/40 text-sm transition"
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? 'Creating...' : (<>Create Account <ArrowRight size={16} /></>)}
            </button>
          </form>

          <p className="text-gray-600 text-sm text-center mt-6">
            Have account?{' '}
            <Link to="/login" className="text-primary hover:text-primary-light transition">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}