import axios from 'axios';

// The baseURL is determined by .env.development or .env.production
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
  withCredentials: true,
});

API.interceptors.request.use((req) => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    
    // Debug logging for developers
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
    
    // Robust error logging
    console.error('🔴 API Failure:', {
      endpoint: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
    
    return Promise.reject(error);
  }
);

export default API;