/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        aavin: {
          blue: '#1E40AF',       // Aavin primary brand / Nice milk blue
          blueLight: '#3B82F6',
          purple: '#7E22CE',     // Delight milk purple
          purpleLight: '#A855F7',
          orange: '#EA580C',     // Full Cream / Tea stall milk orange
          orangeLight: '#FB923C',
          cream: '#FEFCE8',
          dairy: '#F8FAFC',
          green: '#15803D',
          dark: '#0F172A'
        }
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        }
      }
    },
  },
  plugins: [],
}
