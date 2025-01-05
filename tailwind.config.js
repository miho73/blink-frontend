/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        white: '#ffffff',
        black: '#000000',
        caption: {
          dark: '#c0c0c0',
          DEFAULT: '#666',
        },
        primary: {
          white: '#A9B9DD', // PANTONE 2717
          light: '#6176C6', // PANTONE 2718
          dark: '##1E1C72' // PANTONE 2748
        },
      },
    },
  },
  plugins: [],
}
