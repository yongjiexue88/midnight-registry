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
        ink: "var(--color-ink)",
        muted: "var(--color-muted)",
        surface: "var(--color-surface)",
        peach: "var(--color-peach)",
        cyan: "var(--color-cyan)",
        lime: "var(--color-lime)",
        gold: "var(--color-gold)",
        pink: "var(--color-pink)",
      },
    },
  },
  plugins: [],
};

export default config;
