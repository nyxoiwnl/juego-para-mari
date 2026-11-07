/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nightwing: {
          50: '#E6F4FF',
          100: '#BAE0FF',
          200: '#91CAFF',
          300: '#69B1FF',
          400: '#4096FF',
          500: '#0080FF',
          600: '#0066CC',
          700: '#004C99',
          800: '#003366',
          900: '#051124',
          neon: '#00D2FF',
          dark: '#050813',
        },
        sunset: {
          100: '#FFE8D6',
          200: '#FFCCA8',
          300: '#FFAF7A',
          400: '#FF8C42',
          500: '#FF6B35',
          600: '#E8531D',
          glow: '#FFA040',
        },
      },
      fontFamily: {
        outfit: ['"Outfit"', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'bat-drift': 'batDrift 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 128, 255, 0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 210, 255, 0.8), 0 0 70px rgba(255, 107, 53, 0.4)' },
        },
      },
    },
  },
  plugins: [],
}
