/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FAF7F2",
        espresso: "#1C1A17",
        rust: {
          DEFAULT: "#C4501F",
          dark: "#9C3F18",
          light: "#E07A4C",
        },
        pine: {
          DEFAULT: "#3D5A4C",
          dark: "#2C4338",
          light: "#5C7E6C",
        },
        stone: {
          DEFAULT: "#8A8378",
          light: "#E8E1D6",
        },
        border: "#E8E1D6",
        background: "#FAF7F2",
        foreground: "#1C1A17",
        primary: {
          DEFAULT: "#1C1A17",
          foreground: "#FAF7F2",
        },
        secondary: {
          DEFAULT: "#E8E1D6",
          foreground: "#1C1A17",
        },
        accent: {
          DEFAULT: "#C4501F",
          foreground: "#FAF7F2",
        },
        muted: {
          DEFAULT: "#F0EBE2",
          foreground: "#8A8378",
        },
        destructive: {
          DEFAULT: "#B3261E",
          foreground: "#FAF7F2",
        },
        success: {
          DEFAULT: "#3D5A4C",
          foreground: "#FAF7F2",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#1C1A17",
        },
      },
      fontFamily: {
        display: ["Archivo", "sans-serif"],
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(28,26,23,0.04), 0 1px 1px rgba(28,26,23,0.03)",
        "card-hover": "0 8px 24px rgba(28,26,23,0.08), 0 2px 6px rgba(28,26,23,0.05)",
        panel: "0 0 0 1px rgba(28,26,23,0.04), 0 12px 32px rgba(28,26,23,0.06)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: 0, transform: "translateY(4px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        "price-pop": {
          "0%": { transform: "scale(1)" },
          "30%": { transform: "scale(1.04)" },
          "100%": { transform: "scale(1)" },
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.25s ease-out",
        "price-pop": "price-pop 0.3s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
      },
    },
  },
  plugins: [],
};
