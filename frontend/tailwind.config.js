/** @type {import('tailwindcss').Config} */
import plugin from "tailwindcss/plugin"

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
      },
      colors: {
        crimeRed: '#b91c1c',
        dangerYellow: '#facc15',
        safeGreen: '#10b981',
        midnight: '#0f172a',
        mapGray: '#1e293b',
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      zIndex: {
        '100': '100',
      },
      boxShadow: {
        neon: '0 0 10px rgba(255,255,255,0.5)',
        deep: '0 0 20px rgba(0,0,0,0.6)',
      },
      animation: {
        pulseSlow: 'pulse 4s ease-in-out infinite',
        fadeIn: 'fadeIn 1s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.100'),
            a: { color: theme('colors.dangerYellow') },
            h1: { fontFamily: theme('fontFamily.orbitron').join(', ') },
            code: { backgroundColor: theme('colors.mapGray') },
          },
        },
      }),
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".hover-glow": {
          transition: "all 0.3s ease-in-out",
          boxShadow: "0 0 15px rgba(255, 215, 0, 0.6)",
        },
        ".hover-glow:hover": {
          boxShadow: "0 0 25px rgba(255, 215, 0, 0.8)",
        },
        ".text-glow": {
          textShadow: "0 2px 8px rgba(255, 255, 255, 0.6)",
        },
        ".text-cinematic": {
          textShadow: "0 4px 12px rgba(27, 38, 59, 0.8)",
        },
      });
    }),
  ],
}
