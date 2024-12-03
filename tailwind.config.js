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
        }
      },
    },
  },
  plugins: [],
}
