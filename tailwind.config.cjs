/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
      },
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        'brand': {
          dark: 'rgb(var(--color-brand-dark) / <alpha-value>)',
          darker: 'rgb(var(--color-brand-darker) / <alpha-value>)',
          surface: 'rgb(var(--color-brand-surface) / <alpha-value>)',
          'surface-light': 'rgb(var(--color-brand-surface-light) / <alpha-value>)',
          primary: 'rgb(var(--color-brand-primary) / <alpha-value>)',
          secondary: 'rgb(var(--color-brand-secondary) / <alpha-value>)',
          tertiary: 'rgb(var(--color-brand-tertiary) / <alpha-value>)',
          burgundy: 'rgb(var(--color-brand-burgundy) / <alpha-value>)'
        },
        'text': {
          DEFAULT: 'rgb(var(--color-text) / <alpha-value>)',
          secondary: 'rgb(var(--color-text-secondary) / <alpha-value>)',
          tertiary: 'rgb(var(--color-text-tertiary) / <alpha-value>)'
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        'brand-dark': 'rgb(var(--color-brand-dark) / <alpha-value>)',
        'brand-darker': 'rgb(var(--color-brand-darker) / <alpha-value>)',
        'brand-surface': 'rgb(var(--color-brand-surface) / <alpha-value>)',
        'brand-surface-light': 'rgb(var(--color-brand-surface-light) / <alpha-value>)',
        'brand-primary': 'rgb(var(--color-brand-primary) / <alpha-value>)',
        'brand-secondary': 'rgb(var(--color-brand-secondary) / <alpha-value>)',
        'brand-tertiary': 'rgb(var(--color-brand-tertiary) / <alpha-value>)',
        'brand-burgundy': 'rgb(var(--color-brand-burgundy) / <alpha-value>)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      height: {
        screen: ["100vh", "100dvh"],
      },
      minHeight: {
        screen: ["100vh", "100dvh"],
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      screens: {
        'xs': '375px',
        'touch': { raw: '(hover: none)' },
        'can-hover': { raw: '(hover: hover)' },
      },
      fontSize: {
        'mobile-xs': ['0.75rem', { lineHeight: '1rem' }],
        'mobile-sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'mobile-base': ['1rem', { lineHeight: '1.5rem', letterSpacing: '-0.01em' }],
        'mobile-lg': ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em' }],
      },
      fontFamily: {
        'sans': ['SF Pro Display', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        'mono': ['SF Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
        'display': ['Industry Inc Base', 'SF Pro Display', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['SF Pro Display', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['SF Mono', 'monospace'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'spin-slow': 'spin 6s linear infinite',
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        'fade-in': 'fade-in 0.3s ease-in-out',
        'slide-in': 'slide-in 0.3s ease-in-out',
        'slide-up': 'slide-up 0.3s ease-in-out',
        'scale-in': 'scale-in 0.2s ease-in-out',
      },
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(8px)',
      },
      touchAction: {
        'manipulation': 'manipulation',
      },
      userSelect: {
        'none': 'none',
      },
      cursor: {
        'default': 'default',
        'pointer': 'pointer',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        glow: {
          '0%': { boxShadow: 'var(--shadow-neon)' },
          '100%': { boxShadow: 'var(--shadow-neon-hover)' }
        },
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      width: {
        'sidebar-width': 'var(--sidebar-width)',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/forms")({
      strategy: 'class',
    }),
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
}