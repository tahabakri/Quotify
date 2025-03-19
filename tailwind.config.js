/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          50: '#1a1a1a',
          100: '#2a2a2a',
          200: '#3a3a3a',
          900: '#0a0a0a'
        }
      }
    },
  },
  plugins: [],
};