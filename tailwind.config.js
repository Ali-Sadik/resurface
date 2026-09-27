/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#000000',
        surface: '#111111',
        raised: '#1C1C1E',
        line: '#232325',
        ink: '#FFFFFF',
        muted: '#8E8E93',
        faint: '#48484A',
        brand: { DEFAULT: '#22C55E', dark: '#16A34A', soft: '#0E2417' },
        gold: { DEFAULT: '#FACC15', soft: '#262008' },
        miss: { DEFAULT: '#EF4444', soft: '#2A1010' },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Text"', 'system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
        rounded: ['ui-rounded', '"SF Pro Rounded"', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
