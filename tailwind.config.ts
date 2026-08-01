import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        magenta: {
          DEFAULT: '#ff2d78',
          dark: '#c0003a',
          light: '#ff6fa0',
          tint: 'rgba(255,45,120,0.08)',
        },
        gold: { DEFAULT: '#ffd726', dark: '#c9a800' },
        surface: {
          black: '#0a0a0a',
          dark: '#111111',
          card: '#1a1a1a',
          elevated: '#222222',
          border: '#2a2a2a',
        },
      },
      fontFamily: {
        display: ['Manrope', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(ellipse at 60% 40%, #3d0030 0%, #1a001a 50%, #0a0a0a 100%)',
      },
      animation: {
        'marquee': 'marquee 30s linear infinite',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
        'fade-up': 'fadeUp 0.7s ease forwards',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        pulseGlow: { '0%,100%': { boxShadow: '0 0 20px rgba(255,45,120,0.4)' }, '50%': { boxShadow: '0 0 50px rgba(255,45,120,0.85)' } },
        fadeUp: { '0%': { opacity: '0', transform: 'translateY(40px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}
export default config
