import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://x1-chat-app.onrender.com/api',
  timeout: 30000,
});

API.interceptors.request.use((req) => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    console.error('Token read error:', e);
  }
  return req;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      try {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Only redirect if not already on login page to avoid loops
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      } catch (e) {
        console.error('Session cleanup error:', e);
      }
    }
    return Promise.reject(error);
  }
);

export default API;