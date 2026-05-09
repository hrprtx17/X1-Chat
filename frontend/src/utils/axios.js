import axios from 'axios';

// Direct API configuration - Frontend calls Render backend directly
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://x1-chat-app.onrender.com/api',
  timeout: 30000,
  withCredentials: true,
});

API.interceptors.request.use((req) => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    
    if (import.meta.env.DEV) {
      console.log(`🚀 ${req.method?.toUpperCase()} ${req.url}`);
    }
  } catch (e) {
    console.error('Auth token interceptor error:', e);
  }
  return req;
}, (error) => Promise.reject(error));

API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle session expiry
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    
    // Log failures in production for easier debugging via browser console
    console.error('❌ API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data
    });
    
    return Promise.reject(error);
  }
);

export default API;