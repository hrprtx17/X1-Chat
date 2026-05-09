import { createContext, useContext, useState, useEffect } from 'react';
import { getUser, getToken, logout as authLogout } from '../utils/auth';
import API from '../utils/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize from localStorage safely on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = getUser();
        const storedToken = getToken();
        if (storedUser && storedToken) {
          setUser(storedUser);
          setToken(storedToken);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setLoading(false);
      }
    };
    initializeAuth();
  }, []);

  const login = (userData, userToken) => {
    try {
      if (!userData || !userToken) return;
      
      localStorage.setItem('token', userToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      setToken(userToken);
      
      console.log('Login successful: State and localStorage updated');
    } catch (e) {
      console.error('Error saving auth data during login:', e);
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await API.post('/auth/register', { name, email, password });
      if (data?.user && data?.token) {
        // Auto-login after registration
        login(data.user, data.token);
        return data;
      }
      throw new Error('Invalid response from registration endpoint');
    } catch (err) {
      console.error('Registration API error:', err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      // Notify backend to clear cookies
      await API.post('/auth/logout').catch(e => console.warn('Logout notification failed', e));
      
      authLogout();
      setUser(null);
      setToken(null);
      console.log('Logout successful: State and localStorage cleared');
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    isLoggedIn: !!token,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};