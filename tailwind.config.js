/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui';

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}', './index.html'],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    base: false,
    themes: ['light'],
  },
};
