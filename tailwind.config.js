/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0a1628',
          dark: '#0d1f35',
          card: '#111f38',
          blue: '#4a6cf7',
          purple: '#6a3de8',
          sky: '#0ea5e9',
          white: '#f0f4ff',
          muted: 'rgba(240,244,255,0.5)',
          border: 'rgba(255,255,255,0.08)',
        }
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif']
      },
      boxShadow: {
        'card': '0 32px 80px rgba(0,0,0,0.4)',
        'btn': '0 12px 35px rgba(74,108,247,0.5)',
        'glow': '0 0 40px rgba(74,108,247,0.3)',
        'input': '0 0 0 4px rgba(74,108,247,0.15)',
        'soft': '0 10px 30px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'float': 'float 4s ease-in-out infinite',
        'drift': 'drift 25s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 0.6s ease forwards',
      },
      keyframes: {
        fadeUp: {
          'from': { opacity: '0', transform: 'translateY(30px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        drift: {
          '0%, 100%': { transform: 'translate(0,0) scale(1)' },
          '33%': { transform: 'translate(30px,-25px) scale(1.05)' },
          '66%': { transform: 'translate(-15px,20px) scale(0.96)' },
        },
        shimmer: {
          'from': { left: '-100%' },
          'to': { left: '200%' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(74,108,247,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(74,108,247,0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'count-up': {
          'from': { opacity: '0', transform: 'translateY(10px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}

