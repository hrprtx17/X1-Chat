import axios from 'axios';

/**
 * Robust API configuration
 * 1. Prioritizes VITE_API_URL if set (Vercel/Local .env)
 * 2. Falls back to hardcoded Render URL in production mode
 * 3. Falls back to localhost:5000 in development mode
 */
const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  return import.meta.env.PROD 
    ? 'https://x1-chat-app.onrender.com/api' 
    : 'http://localhost:5000/api';
};

const API = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000,
  withCredentials: true,
});

API.interceptors.request.use((req) => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    
    // Always log the actual target URL in development to verify it's NOT localhost when it shouldn't be
    if (import.meta.env.DEV) {
      console.log(`📡 [API Request] ${req.method?.toUpperCase()} ${req.baseURL}${req.url}`);
    }
  } catch (e) {
    console.error('Auth interceptor error:', e);
  }
  return req;
}, (error) => Promise.reject(error));

API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Session expiry handling
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    
    // Robust error logging for production debugging
    console.error('🔴 API Failure:', {
      endpoint: error.config?.url,
      fullURL: `${error.config?.baseURL}${error.config?.url}`,
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
    
    return Promise.reject(error);
  }
);

export default API;