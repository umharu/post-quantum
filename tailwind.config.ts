import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}", "*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        "neon-bg-primary": "#0f1624",
        "neon-bg-surface": "#1a2233",
        "neon-text-primary": "#e6e8f0",
        "neon-text-muted": "#a8b0c3",
        "neon-cyan": "#00e0ff",
        "neon-purple": "#a600ff",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        "neon-gradient": "linear-gradient(135deg, #00e0ff 0%, #a600ff 100%)",
        "neon-gradient-subtle": "linear-gradient(135deg, rgba(0, 224, 255, 0.1) 0%, rgba(166, 0, 255, 0.1) 100%)",
      },
      boxShadow: {
        "neon-cyan": "0 0 20px rgba(0, 224, 255, 0.3), 0 0 40px rgba(0, 224, 255, 0.3)",
        "neon-purple": "0 0 20px rgba(166, 0, 255, 0.3), 0 0 40px rgba(166, 0, 255, 0.3)",
        "neon-mixed": "0 0 20px rgba(0, 224, 255, 0.3), 0 0 40px rgba(166, 0, 255, 0.3)",
      },
      animation: {
        "neon-pulse": "neon-pulse 2s ease-in-out infinite",
      },
      keyframes: {
        "neon-pulse": {
          "0%, 100%": {
            boxShadow: "0 0 20px rgba(0, 224, 255, 0.3), 0 0 40px rgba(0, 224, 255, 0.3)",
          },
          "50%": {
            boxShadow: "0 0 20px rgba(166, 0, 255, 0.3), 0 0 40px rgba(166, 0, 255, 0.3)",
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
