/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      colors: {
        psu: {
          blue: {
            50: '#eef6ff',
            100: '#d9ebff',
            200: '#bcd9ff',
            300: '#8ec0fe',
            400: '#599cfc',
            500: '#3277f7',
            600: '#1b56eb',
            700: '#1441d8',
            800: '#1736ad',
            900: '#193188',
            950: '#0f1f56',
            DEFAULT: '#1a3a6b',
            light: '#0a5bc4',
            dark: '#0f2347',
          },
          accent: {
            DEFAULT: '#004aad',
            light: '#2563eb',
            dark: '#003380',
          },
          gold: {
            DEFAULT: '#f59e0b',
            light: '#fbbf24',
            dark: '#d97706',
          }
        },
      },
    },
  },
  plugins: [],
}