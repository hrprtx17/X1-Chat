import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function LandingNav() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white font-bold">
              X1
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">X1Chat</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">How it works</a>
            <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Pricing</a>
            
            {user ? (
              <Link to="/dashboard" className="btn-primary py-2 px-4 text-sm">
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-primary transition-colors">
                  Log in
                </Link>
                <Link to="/register" className="btn-primary py-2 px-4 text-sm">
                  Sign up free
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 px-4 pt-2 pb-6 space-y-4">
          <a href="#features" className="block text-base font-medium text-gray-700" onClick={() => setIsOpen(false)}>Features</a>
          <a href="#how-it-works" className="block text-base font-medium text-gray-700" onClick={() => setIsOpen(false)}>How it works</a>
          <a href="#pricing" className="block text-base font-medium text-gray-700" onClick={() => setIsOpen(false)}>Pricing</a>
          <hr className="border-gray-100" />
          {user ? (
            <Link to="/dashboard" className="block btn-primary w-full text-center py-3">Dashboard</Link>
          ) : (
            <div className="space-y-3">
              <Link to="/login" className="block text-center text-base font-medium text-gray-700">Log in</Link>
              <Link to="/register" className="block btn-primary w-full text-center py-3">Sign up free</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}