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

  const login = async (email, password) => {
    try {
      const { data } = await API.post('/auth/login', { email: email.trim(), password });
      
      if (data?.token && data?.user) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        setUser(data.user);
        setToken(data.token);
        
        console.log('✅ Login successful');
        return data;
      } else {
        console.error('Invalid login response structure:', data);
        throw new Error('Server returned an invalid authentication response');
      }
    } catch (error) {
      console.error('Login error:', error);
      // Ensure we throw an object with a message property for toast
      const message = error.response?.data?.message || error.message || 'Login failed';
      throw { ...error, message };
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await API.post('/auth/register', { 
        name: name.trim(), 
        email: email.trim().toLowerCase(), 
        password 
      });
      
      if (data?.token && data?.user) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        setUser(data.user);
        setToken(data.token);
        return data;
      } else {
        throw new Error('Server returned an invalid registration response');
      }
    } catch (error) {
      console.error('Registration error:', error);
      const message = error.response?.data?.message || error.message || 'Registration failed';
      throw { ...error, message };
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