/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'bg-primary': '#050B18',
        'bg-secondary': '#0A1628',
        'bg-card': '#0D1F3C',
        'accent-purple': '#6C4FF6',
        'accent-blue': '#3B82F6',
        'accent-cyan': '#22D3EE',
        'text-primary': '#FFFFFF',
        'text-secondary': '#94A3B8',
        'border': 'rgba(255,255,255,0.08)',
        'success': '#10B981',
        'error': '#EF4444',
        'warning': '#F59E0B',
        brand: {
          navy: '#0A1628',
          dark: '#0D1F3C',
          card: '#0D1F3C',
          blue: '#3B82F6',
          purple: '#6C4FF6',
          sky: '#22D3EE',
          white: '#FFFFFF',
          muted: 'rgba(148,163,184,0.5)',
          border: 'rgba(255,255,255,0.08)',
        }
      },
      fontFamily: {
        display: ['Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif']
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

