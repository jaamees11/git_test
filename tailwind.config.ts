import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        game: {
          bg: '#080810',
          panel: '#0f0f1e',
          'panel-alt': '#14142a',
          border: '#252545',
          'border-bright': '#3a3a6a',
          accent: '#4cc9f0',
          gold: '#ffd60a',
          pink: '#f72585',
          green: '#06d6a0',
          purple: '#7209b7',
          red: '#ef233c',
          orange: '#fb8500',
        },
        room: {
          'wall-left': '#F5E6C8',
          'wall-right': '#E8D4A4',
          'wall-top': '#F0E8C8',
          floor: '#8B6344',
          'floor-dark': '#6B4A2A',
          'floor-light': '#A07550',
        },
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        orbitron: ['Orbitron', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'game-gradient': 'linear-gradient(135deg, #080810 0%, #0f0f2e 50%, #080810 100%)',
        'gold-gradient': 'linear-gradient(135deg, #ffd60a 0%, #fb8500 100%)',
        'xp-gradient': 'linear-gradient(90deg, #f72585 0%, #7209b7 50%, #4cc9f0 100%)',
        'panel-gradient': 'linear-gradient(135deg, #0f0f1e 0%, #14142a 100%)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
        'bounce-in': 'bounceIn 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97)',
        'slide-up': 'slideUp 0.4s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'confetti': 'confetti 1s ease-out forwards',
        'level-up': 'levelUp 0.8s cubic-bezier(0.36, 0.07, 0.19, 0.97)',
        'xp-float': 'xpFloat 1.5s ease-out forwards',
        'star-burst': 'starBurst 0.8s ease-out forwards',
        'shake': 'shake 0.5s ease-in-out',
        'glow-pulse': 'glowPulse 1.5s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(76, 201, 240, 0.3)' },
          '50%': { boxShadow: '0 0 25px rgba(76, 201, 240, 0.7), 0 0 50px rgba(76, 201, 240, 0.3)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        levelUp: {
          '0%': { transform: 'scale(0.5) rotate(-10deg)', opacity: '0' },
          '40%': { transform: 'scale(1.3) rotate(3deg)', opacity: '1' },
          '70%': { transform: 'scale(0.95) rotate(-1deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        xpFloat: {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '1' },
          '50%': { transform: 'translateY(-30px) scale(1.2)', opacity: '1' },
          '100%': { transform: 'translateY(-60px) scale(0.8)', opacity: '0' },
        },
        starBurst: {
          '0%': { transform: 'scale(0) rotate(0deg)', opacity: '1' },
          '50%': { transform: 'scale(1.5) rotate(180deg)', opacity: '1' },
          '100%': { transform: 'scale(0) rotate(360deg)', opacity: '0' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-3px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(3px)' },
        },
        glowPulse: {
          '0%, 100%': { filter: 'drop-shadow(0 0 6px rgba(255, 214, 10, 0.6))' },
          '50%': { filter: 'drop-shadow(0 0 18px rgba(255, 214, 10, 0.9))' },
        },
      },
      boxShadow: {
        'game': '0 0 20px rgba(76, 201, 240, 0.15), 0 4px 16px rgba(0,0,0,0.5)',
        'game-lg': '0 0 40px rgba(76, 201, 240, 0.2), 0 8px 32px rgba(0,0,0,0.6)',
        'gold': '0 0 20px rgba(255, 214, 10, 0.3), 0 4px 16px rgba(0,0,0,0.5)',
        'inner-glow': 'inset 0 0 20px rgba(76, 201, 240, 0.1)',
        'panel': '0 4px 24px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
      },
      borderRadius: {
        'game': '12px',
        'game-lg': '16px',
      },
    },
  },
  plugins: [],
}
export default config
