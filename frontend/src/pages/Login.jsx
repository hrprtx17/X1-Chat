import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import API from '../utils/axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      console.log('Attempting login for:', email);
      const { data } = await API.post('/auth/login', { email, password });
      
      if (data?.user && data?.token) {
        // Call login() from context first to update state and storage
        login(data.user, data.token);
        console.log('Auth state updated, proceeding to navigate...');
        
        toast.success('Welcome back!');
        
        // Ensure navigation happens AFTER state update
        if (data.user.role === 'admin') {
          navigate('/dashboard');
        } else {
          navigate('/chat');
        }
      } else {
        throw new Error('Invalid server response');
      }
    } catch (error) {
      console.error('Login error:', error);
      const msg = error.response?.data?.message || 'Login failed. Check credentials.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail('admin@x1chat.com');
    setPassword('admin123'); // Updated to match user's demo credentials in instructions
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side: Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">
              X1
            </div>
            <span className="text-2xl font-bold text-gray-900">X1Chat</span>
          </div>

          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Sign in to your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link to="/register" className="font-medium text-primary hover:text-primary-600 transition-colors">
              start your 14-day free trial
            </Link>
          </p>

          <div className="mt-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email address</label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field pl-10"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pl-10"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 text-base shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign in'}
                {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Demo Access</span>
                </div>
              </div>

              <div className="mt-4">
                <button
                  onClick={handleDemoLogin}
                  className="w-full btn-secondary py-2"
                >
                  Fill Admin Credentials
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Visual */}
      <div className="hidden lg:block relative w-0 flex-1 bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-700 flex flex-col justify-center px-12 text-white">
          <div className="max-w-md">
            <h3 className="text-4xl font-bold mb-6">One inbox. Infinite leverage.</h3>
            <p className="text-xl text-primary-50">
              X1Chat learns from every conversation, helping your team resolve issues 10x faster with AI-powered support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}