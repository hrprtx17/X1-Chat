export const getToken = () => {
  try {
    return localStorage.getItem('token') || null;
  } catch (e) {
    console.error('Error reading token from localStorage:', e);
    return null;
  }
};

export const getUser = () => {
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading user from localStorage:', e);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return null;
  }
};

export const isLoggedIn = () => !!getToken();

export const logout = () => {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  } catch (e) {
    console.error('Error during logout:', e);
  }
};