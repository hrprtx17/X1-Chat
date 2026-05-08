export const getToken = () => localStorage.getItem('token');
export const getUser = () => {
  const raw = localStorage.getItem('user');
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    // Recover gracefully if localStorage gets corrupted.
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return null;
  }
};
export const isLoggedIn = () => !!localStorage.getItem('token');
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};