import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/AppLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';
import Tickets from './pages/Tickets';
import Dashboard from './pages/Dashboard';
import FAQ from './pages/FAQ';
import Settings from './pages/Settings';

function AppLayoutWrapper({ children, isDark, toggleTheme }) {
  return <AppLayout isDark={isDark} toggleTheme={toggleTheme}>{children}</AppLayout>;
}

function AnimatedRoutes({ isDark, toggleTheme }) {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -6, filter: 'blur(8px)' }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
      >
        <Routes location={location}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes with AppLayout */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppLayoutWrapper isDark={isDark} toggleTheme={toggleTheme}>
                  <Dashboard isDark={isDark} />
                </AppLayoutWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="/tickets"
            element={
              <ProtectedRoute>
                <AppLayoutWrapper isDark={isDark} toggleTheme={toggleTheme}>
                  <Tickets isDark={isDark} />
                </AppLayoutWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <AppLayoutWrapper isDark={isDark} toggleTheme={toggleTheme}>
                  <Chat isDark={isDark} />
                </AppLayoutWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="/faqs"
            element={
              <ProtectedRoute>
                {user?.role === 'admin' ? (
                  <AppLayoutWrapper isDark={isDark} toggleTheme={toggleTheme}>
                    <FAQ isDark={isDark} />
                  </AppLayoutWrapper>
                ) : (
                  <Navigate to="/dashboard" />
                )}
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <AppLayoutWrapper isDark={isDark} toggleTheme={toggleTheme}>
                  <Settings isDark={isDark} toggleTheme={toggleTheme} />
                </AppLayoutWrapper>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  return (
    <AuthProvider>
      <BrowserRouter>
        <AnimatedRoutes isDark={isDark} toggleTheme={toggleTheme} />
      </BrowserRouter>
    </AuthProvider>
  );
}