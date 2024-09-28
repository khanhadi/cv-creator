/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui';

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}', './index.html'],
  theme: {
    fontFamily: {
      sans: ['Proxima Nova', 'Arial', 'sans-serif'],
    },
    extend: {
      boxShadow: {
        '2xl': 'rgba(149, 157, 165, 0.2) 0px 8px 24px;',
      },
      colors: {
        accent: '#00D7BF',
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    base: false,
    themes: ['light'],
  },
};
