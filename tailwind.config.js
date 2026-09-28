/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        studio: {
          milk: '#FBFBFA',
          oat: '#F5F3ED',
          sand: '#ECE8DF',
          graphite: '#262626',
          charcoal: '#1A1A1A',
          muted: '#737373',
          border: 'rgba(38, 38, 38, 0.08)',
          blush: '#F7E7E2',
          blushLight: '#FCF5F3',
          sage: '#E5EBE5',
          gold: '#C5A880',
          accent: '#E65D47',
        },
        frame: {
          white: '#FFFFFF',
          charcoal: '#1F1F1F',
          oat: '#F5F3ED',
          blush: '#FCEEE9',
          sage: '#E2E8E2',
          lavender: '#EFEAF4',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'soft-sm': '0 2px 8px -2px rgba(38, 38, 38, 0.05), 0 1px 4px -1px rgba(38, 38, 38, 0.03)',
        'soft': '0 8px 24px -4px rgba(38, 38, 38, 0.06), 0 4px 12px -2px rgba(38, 38, 38, 0.04)',
        'soft-lg': '0 16px 36px -6px rgba(38, 38, 38, 0.08), 0 8px 16px -4px rgba(38, 38, 38, 0.04)',
        'photo': '0 20px 45px -10px rgba(0, 0, 0, 0.12), 0 2px 6px 0 rgba(0, 0, 0, 0.04)',
        'inner-glow': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.8)',
      },
      keyframes: {
        flash: {
          '0%': { opacity: '0.98', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(1.01)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        popIn: {
          '0%': { transform: 'scale(0.92)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        }
      },
      animation: {
        flash: 'flash 0.45s ease-out forwards',
        pulseGlow: 'pulseGlow 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        popIn: 'popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      }
    },
  },
  plugins: [],
};
