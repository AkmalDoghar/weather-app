import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        'wx-sm': '10px',
        'wx-md': '16px',
        'wx-lg': '24px',
      },
      colors: {
        primary: "#4FC3F7",
        sunny: "#FDB813",
        night: "#0B1F3A",
        rain: "#607D8B",
        cloud: "#ECEFF1",
        danger: "#FF5252",
        success: "#4CAF50",
        warning: "#FFB300",
        weather: {
          dark: "#0b132b",
          darker: "#060b19",
          cardDark: "rgba(15, 23, 42, 0.65)",
          cardLight: "rgba(255, 255, 255, 0.75)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        manrope: ["var(--font-manrope)", "Manrope", "sans-serif"],
        poppins: ["var(--font-poppins)", "Poppins", "sans-serif"],
        urdu: ["var(--font-nastaliq)", "Noto Nastaliq Urdu", "Arial", "sans-serif"],
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        "spin-slow": "spin 12s linear infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
