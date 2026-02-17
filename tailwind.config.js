/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#020617', // slate-950
        foreground: '#f8fafc', // slate-50
        primary: {
          DEFAULT: '#ea580c', // rust
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#00ff9d', // cyber
          foreground: '#020617',
        },
        muted: {
          DEFAULT: '#1e293b', // slate-800
          foreground: '#94a3b8', // slate-400
        },
        accent: {
          DEFAULT: '#1e293b', // slate-800
          foreground: '#f8fafc', // slate-50
        },
        card: {
          DEFAULT: '#0f172a', // slate-900
          foreground: '#f8fafc', // slate-50
        },
        border: '#1e293b', // slate-800
        
        // Brand colors explicitly
        rust: {
          DEFAULT: '#ea580c',
          light: '#f97316',
          dark: '#c2410c',
        },
        cyber: {
          DEFAULT: '#00ff9d',
          dim: 'rgba(0, 255, 157, 0.3)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
      }
    },
  },
  plugins: [],
}
