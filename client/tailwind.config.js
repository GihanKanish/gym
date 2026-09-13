/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0a0a0b',
          900: '#121214',
          800: '#1a1a1d',
          700: '#242428',
          600: '#33343a',
        },
        volt: {
          400: '#e8ff5b',
          500: '#d4ff00',
          600: '#a8cc00',
        },
        ember: {
          400: '#ff7a45',
          500: '#ff5a1f',
          600: '#e0430e',
        },
      },
      fontFamily: {
        display: ['"Archivo Black"', '"Arial Black"', 'sans-serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
