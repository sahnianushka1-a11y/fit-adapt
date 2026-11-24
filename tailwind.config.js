/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#070b16',
          900: '#0b1020',
          850: '#0f1528',
          800: '#141b33',
          750: '#1a2340',
          700: '#222d4f',
          600: '#2e3a63',
        },
        lime: {
          50: '#f7ffe5',
          100: '#ecffbf',
          200: '#dcff80',
          300: '#c6ff3d',
          400: '#aef50a',
          500: '#8fd600',
          600: '#6fa800',
          700: '#567f00',
        },
        violet: {
          400: '#b69bff',
          500: '#9d6bff',
          600: '#7c3aed',
        },
        cyan: {
          400: '#5ee0ff',
          500: '#22cff5',
          600: '#06b6d4',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 40px -10px rgba(174,245,10,0.35)',
        violet: '0 0 40px -10px rgba(157,107,255,0.45)',
        card: '0 10px 30px -12px rgba(0,0,0,0.6)',
      },
      backgroundImage: {
        'radial-glow': 'radial-gradient(60% 60% at 50% 0%, rgba(157,107,255,0.18) 0%, transparent 70%)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-in': {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.8)', opacity: '0.8' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out both',
        'fade-in': 'fade-in 0.4s ease-out both',
        'scale-in': 'scale-in 0.35s ease-out both',
        'slide-in': 'slide-in 0.4s ease-out both',
        shimmer: 'shimmer 2s infinite linear',
        float: 'float 4s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 1.6s ease-out infinite',
      },
    },
  },
  plugins: [],
};
