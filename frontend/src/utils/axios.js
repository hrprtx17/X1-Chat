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
    const originalRequest = error.config;
    
    // Handle Network Errors (no response from server)
    if (!error.response) {
      console.error('🌐 Network Error: Please check if the backend server is running and accessible.', {
        url: originalRequest?.url,
        method: originalRequest?.method
      });
      return Promise.reject({
        message: 'Network error: Backend server is unreachable.',
        isNetworkError: true
      });
    }

    // Handle Session Expiry
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Only redirect if not already on an auth page
      if (!['/login', '/register'].includes(window.location.pathname)) {
        window.location.href = '/login?expired=true';
      }
    }
    
    // Robust error logging for debugging
    console.error('🔴 API Failure:', {
      endpoint: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      data: error.response?.data
    });
    
    return Promise.reject(error);
  }
);

export default API;