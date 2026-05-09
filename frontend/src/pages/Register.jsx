import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      await register(name, email, password);
      toast.success('Account created! Please log in.');
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      const msg = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side: Visual */}
      <div className="hidden lg:block relative w-0 flex-1 bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-400 flex flex-col justify-center px-12 text-white">
          <div className="max-w-md">
            <h3 className="text-4xl font-bold mb-6">Built for support superstars.</h3>
            <p className="text-xl text-primary-50">
              Join 1,000+ companies using X1Chat to deliver exceptional customer experiences without the overhead.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-sm lg:w-96">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">
              X1
            </div>
            <span className="text-2xl font-bold text-gray-900">X1Chat</span>
          </div>

          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary hover:text-primary-600 transition-colors">
              Sign in here
            </Link>
          </p>

          <div className="mt-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field pl-10"
                    placeholder="Jane Doe"
                  />
                </div>
              </div>

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
                {loading ? 'Creating account...' : 'Get Started'}
                {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}