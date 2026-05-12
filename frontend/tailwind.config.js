/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0D1B2A',
          surface: '#162032',
        },
        gold: {
          DEFAULT: '#C9A96E',
          light: '#D4B97E',
        },
        warm: {
          DEFAULT: '#F0EBE3',
          muted: '#8B96A5',
        },
        success: '#4CAF82',
        warning: '#E8A838',
        danger: '#E05555',
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
