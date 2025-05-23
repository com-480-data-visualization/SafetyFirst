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
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
      },
      colors: {
        primary: "#145A60",
        secondary: "#A1D381",
        accent: "#58B59A",
        danger: "#A1D381",
        success:  "#88D0D1",
        dark: "#1E2D2F",
        light: "#F4F8F9",
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
        subtle: '0 2px 15px rgba(0,0,0,0.1)',
        deep: '0 0 20px rgba(0,0,0,0.2)',
      },
      animation: {
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
            color: theme('colors.slate.800'),
            a: { color: theme('colors.primary') },
            h1: { fontFamily: theme('fontFamily.heading').join(', ') },
            code: { backgroundColor: theme('colors.slate.100') },
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
        ".hover-lift": {
          transition: "all 0.2s ease-in-out",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
        },
        ".hover-lift:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0 6px 15px rgba(0, 0, 0, 0.1)",
        },
        ".text-emphasis": {
          fontWeight: "600",
        },
      });
    }),
  ],
}
