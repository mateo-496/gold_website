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
        serif: ["var(--font-serif)", "serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      keyframes: {
        scrollHint: {
          "0%": { transform: "translateY(0)", opacity: "1" },
          "70%": { transform: "translateY(12px)", opacity: "1" },
          "100%": { transform: "translateY(12px)", opacity: "0" },
        }
      },
      animation: {
        scrollHint: "scrollHint 1.6s ease-in-out infinite",
      }
    },
  },
  plugins: [],
};
export default config;
