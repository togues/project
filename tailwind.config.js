/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./js/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary-color)',
        secondary: 'var(--secondary-color)',
        'modal-bg': 'var(--modal-bg)',
        'panel-border': 'var(--panel-border)',
      }
    },
  },
  plugins: [],
}