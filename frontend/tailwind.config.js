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
        heading: ['Prompt', 'sans-serif'],
        sans: ['Sarabun', 'Prompt', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        // Legacy compatibility
        'psu-blue': {
          light: '#0a5bc4',
          DEFAULT: '#1a3a6b',
          dark: '#0f2347',
        },
        'psu-accent': '#004aad',

        // Stitch Official Design Tokens
        psu: {
          navy: '#1A365D',      // Deep Royal PSU Navy
          dark: '#0F2544',      // Deepest Midnight PSU Blue
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
            DEFAULT: '#005EA2', // Stitch Accent vibrant blue
            light: '#00A3E0',   // Stitch Sky blue
            dark: '#0F2544',    // Midnight dark
          },
          accent: {
            DEFAULT: '#004aad',
            light: '#2563eb',
            dark: '#003380',
          },
          light: '#00A3E0',     // Stitch Sky blue / Cyan accent
          surface: '#F8FAFC',   // Light surface
          gold: {
            DEFAULT: '#f59e0b',
            light: '#fbbf24',
            dark: '#d97706',
          }
        },
      },
      boxShadow: {
        'glow': '0 4px 20px -2px rgba(0, 94, 162, 0.35)',
        'card-elevated': '0 10px 30px -5px rgba(15, 37, 68, 0.15)',
        'glass': '0 8px 32px 0 rgba(15, 37, 68, 0.08)',
      },
    },
  },
  plugins: [],
};