/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        jet: "#0a0a0a",
        gulf: "#2a2a2a",
        gold: "#C8C8C8",
        "gold-dim": "#888888",
        "gulf-dark": "#111111",
      },
      fontFamily: {
        display: ["Bebas Neue", "sans-serif"],
        body: ["DM Sans", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        gold: "0 0 30px rgba(212,175,55,0.15)",
        gulf: "0 0 30px rgba(30,58,138,0.3)",
        glow: "0 0 60px rgba(212,175,55,0.25)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        pulse_gold: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.4 },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        ticker: "ticker 30s linear infinite",
        pulse_gold: "pulse_gold 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
}