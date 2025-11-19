// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        tajawal: ["Tajawal", "sans-serif"],
      },
      animation: {
        'slide-in-right': 'slide-in-right 0.5s ease-out',
        'progress': 'progress 5s linear forwards',
        'scroll': 'scroll 2s infinite',
      }
    },
  },
  plugins: [],
}
