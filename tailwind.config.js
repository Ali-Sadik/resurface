/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#16A34A', dark: '#15803D', light: '#F0FDF4', soft: '#DCFCE7', mint: '#86EFAC' },
        ink: '#111827',
        muted: '#6B7280',
        canvas: '#F4F6F5',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Text"', 'system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
        rounded: ['ui-rounded', '"SF Pro Rounded"', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(17,24,39,0.04), 0 10px 28px -16px rgba(17,24,39,0.18)',
        hero: '0 2px 4px rgba(21,128,61,0.05), 0 22px 44px -24px rgba(21,128,61,0.35)',
        nav: '0 -1px 0 rgba(17,24,39,0.06), 0 -8px 24px -12px rgba(17,24,39,0.10)',
      },
      borderRadius: { '2.5xl': '22px' },
    },
  },
  plugins: [],
};
