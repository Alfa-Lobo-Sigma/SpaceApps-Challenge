/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        muted: '#8ba0b3',
        panel: '#131a2a',
        background: '#0b1020',
      }
    },
  },
  plugins: [],
}
