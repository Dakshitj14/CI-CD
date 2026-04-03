import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "hsl(var(--bg))",
        panel: "hsl(var(--panel))",
        panel2: "hsl(var(--panel-2))",
        line: "hsl(var(--line))",
        text: "hsl(var(--text))",
        muted: "hsl(var(--muted))",
        neon: "hsl(var(--neon))",
        neon2: "hsl(var(--neon-2))",
        danger: "hsl(var(--danger))",
        success: "hsl(var(--success))",
      },
      boxShadow: {
        glass: "0 18px 60px rgba(0, 0, 0, 0.4)",
      },
      backgroundImage: {
        "radial-grid":
          "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "0.5", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.08)" },
        },
        floatUp: {
          "0%": { transform: "translateY(6px)", opacity: "0.2" },
          "100%": { transform: "translateY(0px)", opacity: "1" },
        },
      },
      animation: {
        pulseGlow: "pulseGlow 3s ease-in-out infinite",
        floatUp: "floatUp 0.5s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
