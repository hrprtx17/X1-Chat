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
    <div className="app-shell min-h-screen flex items-center justify-center px-4 py-8">
      <Toaster position="top-center" toastOptions={{ style: { background: 'var(--surface-strong)', color: 'var(--text-main)', border: '1px solid var(--border-soft)' } }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl relative z-10"
      >
        <div className="grid lg:grid-cols-2 glass-card overflow-hidden">
          <div className="hidden lg:flex items-center justify-center p-8 relative order-2">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,167,107,0.3),transparent_55%)]" />
            <div className="glass rounded-3xl p-6 border border-orange-200/50 max-w-md w-full relative z-10">
              <p className="text-sm text-[var(--text-soft)] mb-3">Build your workspace</p>
              <div className="bg-[var(--surface-strong)] border border-orange-200/60 rounded-2xl px-4 py-4 text-[var(--text-main)]">
                Launch your AI support assistant in minutes
              </div>
            </div>
          </div>

          <div className="p-8 lg:p-10 bg-[var(--surface-strong)] order-1">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-amber-300 flex items-center justify-center">
                <Zap size={18} className="text-amber-950" />
              </div>
              <span className="font-semibold text-[var(--text-main)] text-xl tracking-tight">X1Chat</span>
            </div>

            <h1 className="text-4xl font-semibold text-[var(--text-main)] mb-1">Create Account</h1>
            <p className="text-[var(--text-soft)] mb-8 text-sm">Create your workspace and start supporting customers with AI.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-xs text-[var(--text-soft)] mb-2 block uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-soft)]" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Harpreet Singh"
                    className="input-premium px-4 py-3 pl-11 placeholder-[var(--text-soft)] text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-[var(--text-soft)] mb-2 block uppercase tracking-wider">Email</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-soft)]" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    className="input-premium px-4 py-3 pl-11 placeholder-[var(--text-soft)] text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-[var(--text-soft)] mb-2 block uppercase tracking-wider">Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-soft)]" />
                  <input
                    type="password"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    className="input-premium px-4 py-3 pl-11 placeholder-[var(--text-soft)] text-sm"
                    required
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? 'Creating...' : (<>Create Account <ArrowRight size={16} /></>)}
              </button>
            </form>

            <p className="text-[var(--text-soft)] text-sm text-center mt-6">
              Have account?{' '}
              <Link to="/login" className="text-[var(--brand)] hover:opacity-85 transition">Sign in</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}