/** @type {import('tailwindcss').Config} */
import plugin from "tailwindcss/plugin"

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
      },
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
