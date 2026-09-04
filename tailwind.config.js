/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tempo: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#b9dffd',
          300: '#7cc2fd',
          400: '#36a2fa',
          500: '#0c84eb',
          600: '#0267c8',
          700: '#0352a1',
          800: '#074684',
          900: '#0c3b6e',
          950: '#082548',
        },
        tempoRed: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#e52421', // Official Tempo Red from logo.svg
          600: '#cc1e1b',
          700: '#a81512',
          800: '#8c1512',
          900: '#731715',
        },
        brandRed: {
          500: '#e52421',
          600: '#cc1e1b',
          700: '#a81512',
        },
        tempoDark: {
          800: '#141c2e',
          900: '#0b1329',
          950: '#070c1b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
