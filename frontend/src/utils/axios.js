import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://x1-chat-app.onrender.com/api',
  timeout: 30000,
  withCredentials: true, // Required for sending cookies in production
});

API.interceptors.request.use((req) => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log requests in development
    if (import.meta.env.DEV) {
      console.log(`🚀 ${req.method?.toUpperCase()} ${req.url}`);
    }
  } catch (e) {
    console.error('Token read error:', e);
  }
  return req;
}, (error) => {
  return Promise.reject(error);
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors (expired or invalid tokens)
    if (error.response?.status === 401) {
      try {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Redirect to login if not already there
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
          console.warn('Session expired, redirecting to login...');
          window.location.href = '/login';
        }
      } catch (e) {
        console.error('Session cleanup error:', e);
      }
    }
    
    // Log detailed errors in development
    if (import.meta.env.DEV) {
      console.error('❌ API Error:', error.response?.data || error.message);
    }
    
    return Promise.reject(error);
  }
);

export default API;