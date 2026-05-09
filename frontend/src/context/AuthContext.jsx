import { createContext, useContext, useState } from 'react';
import { getUser, getToken, logout as authLogout } from '../utils/auth';
import API from '../utils/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getUser());
  const [token, setToken] = useState(getToken());

  const login = (userData, userToken) => {
    try {
      localStorage.setItem('token', userToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setToken(userToken);
    } catch (e) {
      console.error('Error saving auth data:', e);
    }
  };

  const register = async (name, email, password) => {
    const res = await API.post('/auth/register', { name, email, password });
    return res.data;
  };

  const logout = () => {
    authLogout();
    setUser(null);
    setToken(null);
  };

  // Provide a safe default user object if null for rendering
  const safeUser = user || { name: 'User', email: '', role: 'user' };

  return (
    <AuthContext.Provider value={{ user: safeUser, token, login, register, logout, isLoggedIn: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};