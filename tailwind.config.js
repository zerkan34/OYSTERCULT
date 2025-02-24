/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand': {
          'dark': 'rgb(var(--color-brand-dark) / <alpha-value>)',
          'darker': 'rgb(var(--color-brand-darker) / <alpha-value>)',
          'surface': 'rgb(var(--color-brand-surface) / <alpha-value>)',
          'surface-light': 'rgb(var(--color-brand-surface-light) / <alpha-value>)',
          'primary': 'rgb(var(--color-brand-primary) / <alpha-value>)',
          'secondary': 'rgb(var(--color-brand-secondary) / <alpha-value>)',
          'tertiary': 'rgb(var(--color-brand-tertiary) / <alpha-value>)',
          'burgundy': 'rgb(var(--color-brand-burgundy) / <alpha-value>)'
        },
        'text': {
          DEFAULT: 'rgb(var(--color-text) / <alpha-value>)',
          'secondary': 'rgb(var(--color-text-secondary) / <alpha-value>)',
          'tertiary': 'rgb(var(--color-text-tertiary) / <alpha-value>)'
        }
      },
      fontFamily: {
        'sans': ['SF Pro Display', 'Inter', 'sans-serif'],
        'mono': ['SF Mono', 'monospace'],
        'industry': ['Industry', 'SF Pro Display', 'sans-serif']
      },
      boxShadow: {
        'glass': 'var(--shadow-glass)',
        'neon': 'var(--shadow-neon)',
        'neon-hover': 'var(--shadow-neon-hover)'
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'spin-slow': 'spin 6s linear infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        glow: {
          '0%': { boxShadow: 'var(--shadow-neon)' },
          '100%': { boxShadow: 'var(--shadow-neon-hover)' }
        }
      }
    }
  },
  plugins: []
};