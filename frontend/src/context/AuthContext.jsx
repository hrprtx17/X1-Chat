import { createContext, useContext, useState, useEffect } from 'react';
import { getUser, getToken, logout as authLogout } from '../utils/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize from localStorage safely on mount
  useEffect(() => {
    const storedUser = getUser();
    const storedToken = getToken();
    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
    }
    setLoading(false);
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

  const logout = () => {
    try {
      authLogout();
      setUser(null);
      setToken(null);
      console.log('Logout successful: State and localStorage cleared');
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  // Provide a safe default user object if null for rendering, 
  // but keep user as null for logic checks like ProtectedRoute
  const value = {
    user,
    token,
    login,
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