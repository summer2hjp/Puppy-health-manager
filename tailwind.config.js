/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#f6f8fc',
          surface: '#ffffff',
          text: '#111827',
          muted: '#6b7280',
          border: '#e5e7eb',
          primary: '#2563eb',
          primaryHover: '#1d4ed8',
          success: '#16a34a',
          warning: '#d97706',
          danger: '#dc2626',
          focus: '#93c5fd'
        }
      },
      boxShadow: {
        card: '0 1px 2px rgba(15,23,42,0.04)',
        popup: '0 10px 20px rgba(2,6,23,0.12)'
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px'
      },
      spacing: {
        18: '72px'
      }
    }
  },
  plugins: []
};