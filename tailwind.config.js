/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui';

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}', './index.html'],
  theme: {
    extend: {
      boxShadow: {
        '2xl': 'rgba(149, 157, 165, 0.2) 0px 8px 24px;',
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    base: false,
    themes: ['light'],
  },
};
