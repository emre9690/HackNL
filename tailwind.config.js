/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        mint: '#4ade80',
        accent: '#fbbf24',
      },
      borderRadius: {
        '44px': '44px',
      },
    },
  },
  plugins: [],
}
