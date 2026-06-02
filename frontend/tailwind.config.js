/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0f",
        foreground: "#f8fafc",
        card: {
          DEFAULT: "rgba(17, 17, 28, 0.7)",
          foreground: "#f8fafc",
          border: "rgba(255, 255, 255, 0.08)",
        },
        primary: {
          DEFAULT: "#6366f1", // Indigo
          hover: "#4f46e5",
          glowing: "rgba(99, 102, 241, 0.15)",
        },
        secondary: {
          DEFAULT: "#8b5cf6", // Violet
          hover: "#7c3aed",
          glowing: "rgba(139, 92, 246, 0.15)",
        },
        accent: {
          cyan: "#06b6d4",
          emerald: "#10b981",
          rose: "#f43f5e",
          amber: "#f59e0b"
        },
        slate: {
          950: "#020617",
          900: "#0f172a",
          800: "#1e293b",
          700: "#334155",
          400: "#94a3b8",
          300: "#cbd5e1"
        }
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Outfit", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "glass-gradient": "linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)",
        "active-gradient": "linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)"
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        "glass": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        "glass-glow": "0 8px 32px 0 rgba(99, 102, 241, 0.12)",
        "glow-purple": "0 0 20px 2px rgba(139, 92, 246, 0.3)",
        "glow-indigo": "0 0 20px 2px rgba(99, 102, 241, 0.3)"
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 8s linear infinite",
      }
    },
  },
  plugins: [],
}
