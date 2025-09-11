/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      colors: {
        dark: {
          bg: '#121212',
          surface: '#1E1E1E',
          card: '#2A2A2A',
          primary: '#00CFFF',
          secondary: '#7B61FF',
          accent: '#A085FF',
          text: '#E0E0E0',
          'text-secondary': '#A0A0A0',
          error: '#FF5C5C',
        }
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0, 207, 255, 0.3)',
        'glow-purple': '0 0 20px rgba(123, 97, 255, 0.3)',
      }
    },
  },
  plugins: [],
};