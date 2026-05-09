export const getStoredToken = () => {
  try {
    return localStorage.getItem('token') || null;
  } catch (e) {
    console.error('Error reading token from localStorage:', e);
    return null;
  }
};

export const getStoredUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (e) {
    console.error('Error reading user from localStorage:', e);
    return null;
  }
};

export const getToken = getStoredToken;
export const getUser = getStoredUser;

export const isLoggedIn = () => !!getStoredToken();

export const logout = () => {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  } catch (e) {
    console.error('Error during logout:', e);
  }
};