/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: { inter: ['Inter', 'sans-serif'] },
      colors: {
        primary: '#00D97E',
        'primary-dark': '#00B569',
        'primary-light': '#00FF94',
        dark: '#030308',
        'dark-card': '#0D0D14',
        'dark-border': '#1A1A2E',
      },
    },
  },
  plugins: [],
}