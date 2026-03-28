import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        body: ["'Plus Jakarta Sans'", "sans-serif"],
      },
      colors: {
        brand: {
          purple: "#6B21A8",
          "purple-light": "#A855F7",
          "purple-dark": "#4A0E3E",
          rose: "#6B1D5E",
          "rose-light": "#8B3D7E",
          blue: "#1D4ED8",
          "blue-electric": "#3B82F6",
          yellow: "#D97706",
          "yellow-warm": "#FCD34D",
          cream: "#F3E8FF",
          dark: "#0F0A1E",
        },
        squad: {
          explorer: "#3B82F6",
          guardian: "#F59E0B",
          visionary: "#7C3AED",
          harmonizer: "#EC4899",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-gradient":
          "linear-gradient(135deg, #0F0A1E 0%, #1E0A3C 50%, #0F0A1E 100%)",
        "card-shimmer":
          "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.07) 50%, transparent 60%)",
      },
      animation: {
        shimmer: "shimmer 2s infinite",
        "fade-up": "fadeUp 0.6s ease forwards",
        "fade-in": "fadeIn 0.4s ease forwards",
        float: "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 8s linear infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
      boxShadow: {
        glow: "0 0 40px rgba(168, 85, 247, 0.3)",
        "glow-rose": "0 0 40px rgba(251, 113, 133, 0.3)",
        "glow-blue": "0 0 40px rgba(59, 130, 246, 0.3)",
        card: "0 4px 24px rgba(0,0,0,0.3)",
      },
    },
  },
  plugins: [],
};
export default config;
