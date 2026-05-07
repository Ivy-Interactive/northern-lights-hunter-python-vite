import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#04060d',
        ink: '#070a16',
        'ink-2': '#0c1124',
        'ink-3': '#141a30',
        'ink-4': '#1d2545',
        'aurora-green': '#5af7c4',
        'aurora-cyan': '#7ad7ff',
        'aurora-violet': '#b78dff',
        'aurora-magenta': '#ff7eb9',
        'aurora-warm': '#ffd166',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        sans: ['Inter Tight', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(0.85)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.4s ease-out',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'pulse-dot': 'pulse-dot 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config
