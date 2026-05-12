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
import WorkspaceSetup from './pages/WorkspaceSetup';
import Workspace from './pages/Workspace';
import FAQ from './pages/FAQ';
import Settings from './pages/Settings';
import { Toaster } from 'react-hot-toast';

function AppLayoutWrapper({ children, isDark, toggleTheme }) {
  return <AppLayout isDark={isDark} toggleTheme={toggleTheme}>{children}</AppLayout>;
}

function AnimatedRoutes({ isDark, toggleTheme }) {
  const location = useLocation();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <Routes location={location}>
          <Route path="/" element={<Landing isDark={isDark} toggleTheme={toggleTheme} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                {isAdmin ? (
                  <AppLayoutWrapper isDark={isDark} toggleTheme={toggleTheme}>
                    <Dashboard isDark={isDark} />
                  </AppLayoutWrapper>
                ) : (
                  <Navigate to="/chat" />
                )}
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
            path="/workspace-setup"
            element={
              <ProtectedRoute>
                <WorkspaceSetup />
              </ProtectedRoute>
            }
          />
          <Route
            path="/workspace"
            element={
              <ProtectedRoute>
                <AppLayoutWrapper isDark={isDark} toggleTheme={toggleTheme}>
                  <Workspace />
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
                {isAdmin ? (
                  <AppLayoutWrapper isDark={isDark} toggleTheme={toggleTheme}>
                    <FAQ isDark={isDark} />
                  </AppLayoutWrapper>
                ) : (
                  <Navigate to="/chat" />
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
    try {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
    } catch (e) {
      console.error('Theme persistence error:', e);
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    try {
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    } catch (e) {
      console.error('Error saving theme:', e);
    }
    
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    document.title = 'X1 Chat | Modern AI Support Platform';
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <AnimatedRoutes isDark={isDark} toggleTheme={toggleTheme} />
      </BrowserRouter>
    </AuthProvider>
  );
}