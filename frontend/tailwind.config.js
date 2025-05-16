// tailwind.config.js
import colors from 'tailwindcss/colors'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  safelist: [
    'demo1',
    'hidden',
    'ki-filled',
    'ki-outline',
    'ki-duotone',
    'ki-solid',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Converted OKLCH colors to RGB format
        red: {
          50: 'rgb(252, 232, 232)',
          100: 'rgb(252, 207, 207)',
          200: 'rgb(251, 169, 169)',
          300: 'rgb(247, 116, 116)',
          400: 'rgb(237, 65, 65)',
          500: 'rgb(214, 41, 41)',
          600: 'rgb(180, 35, 35)',
          700: 'rgb(142, 35, 35)',
          800: 'rgb(110, 33, 33)',
          900: 'rgb(80, 28, 28)',
          950: 'rgb(45, 17, 17)'
        },
        // Add other color scales similarly...
        
        // Custom colors
        coal: {
          100: '#15171C',
          200: '#13141A',
          300: '#111217',
          400: '#0F1014',
          500: '#0D0E12',
          600: '#0B0C10',
          black: '#000000',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['ui-serif', 'Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace']
      },
      spacing: {
        0.75: '0.1875rem',
        1.25: '0.3rem',
        1.75: '0.4375rem',
        2.25: '0.563rem',
        2.75: '0.688rem',
        4.5: '1.125rem',
        5.5: '1.375rem',
        6.5: '1.625rem',
        7.5: '1.875rem',
        12.5: '3.125rem',
      },
      fontSize: {
        '4xs': ['0.5625rem', { lineHeight: '0.6875rem' }],
        '3xs': ['0.625rem', { lineHeight: '0.75rem' }],
        '2xs': ['0.6875rem', { lineHeight: '0.75rem' }],
        '2sm': ['0.8125rem', { lineHeight: '1.125rem' }],
        'md': ['0.9375rem', { lineHeight: '1.375rem' }],
        '1.5xl': ['1.375rem', { lineHeight: '1.8125rem' }],
        '2.5xl': ['1.625rem', { lineHeight: '2.125rem' }]
      },
      boxShadow: {
        card: '0 4px 12px rgba(0, 0, 0, 0.09)',
        light: '0 3px 4px rgba(0, 0, 0, 0.03)',
        primary: '0 4px 12px rgba(40, 132, 239, 0.35)',
        success: '0 4px 12px rgba(53, 189, 100, 0.35)',
        danger: '0 4px 12px rgba(241, 65, 108, 0.35)',
        info: '0 4px 12px rgba(114, 57, 234, 0.35)',
        warning: '0 4px 12px rgba(246, 192, 0, 0.35)',
        dark: '0 4px 12px rgba(37, 47, 74, 0.35)'
      },
      borderRadius: {
        xs: '0.125rem',
        sm: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem'
      },
      keyframes: {
        spin: {
          to: { transform: 'rotate(360deg)' }
        },
        ping: {
          '75%, 100%': { transform: 'scale(2)', opacity: '0' }
        },
        pulse: {
          '50%': { opacity: '0.5' }
        },
        bounce: {
          '0%, 100%': { 
            transform: 'translateY(-25%)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)'
          },
          '50%': { 
            transform: 'none',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)'
          }
        }
      },
      animation: {
        spin: 'spin 1s linear infinite',
        ping: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        bounce: 'bounce 1s infinite'
      }
    },
    container: {
      center: true,
      padding: '1rem',
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px'
      }
    }
  },
  plugins: [],
}