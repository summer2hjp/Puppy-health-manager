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
          focus: '#93c5fd',
          error: '#ef4444'
        }
      },
      boxShadow: {
        card: '0 1px 2px rgba(15,23,42,0.04)',
        cardHover: '0 4px 12px rgba(15,23,42,0.08)',
        popup: '0 10px 20px rgba(2,6,23,0.12)',
        float: '0 8px 32px rgba(0, 0, 0, 0.1)'
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px'
      },
      spacing: {
        18: '72px'
      },
      screens: {
        xs: '475px'
      },
      transitionTimingFunction: {
        bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
      }
    }
  },
  plugins: []
};