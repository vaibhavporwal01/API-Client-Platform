import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fdf4ff',
          100: '#fae8ff',
          200: '#f3d0ff',
          300: '#e9a8ff',
          400: '#d97aff',
          500: '#c146f5',
          600: '#a626d9',
          700: '#8b1db7',
          800: '#731c96',
          900: '#5f1a79',
          950: '#3d0555',
        },
        surface: {
          50:  '#f8f9fa',
          100: '#f1f3f5',
          200: '#e9ecef',
          800: '#1e2128',
          850: '#181b21',
          900: '#13161c',
          950: '#0d0f14',
        },
        method: {
          GET:     '#22c55e',
          POST:    '#f97316',
          PUT:     '#3b82f6',
          PATCH:   '#a855f7',
          DELETE:  '#ef4444',
          HEAD:    '#06b6d4',
          OPTIONS: '#f59e0b',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'fade-in':    'fadeIn 0.2s ease-out',
        'slide-down': 'slideDown 0.2s ease-out',
        'pulse-once': 'pulseOnce 0.4s ease-out',
      },
      keyframes: {
        fadeIn:    { from: { opacity: '0' },               to: { opacity: '1' } },
        slideDown: { from: { transform: 'translateY(-8px)', opacity: '0' }, to: { transform: 'translateY(0)', opacity: '1' } },
        pulseOnce: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.5' } },
      },
    },
  },
  plugins: [],
};

export default config;
