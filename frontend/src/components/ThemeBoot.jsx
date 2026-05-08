import { useEffect } from 'react';

export default function ThemeBoot() {
  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  return null;
}

