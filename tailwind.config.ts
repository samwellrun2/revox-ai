import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#FAFAFA",
          text: "#0A0A0A",
          primary: "#4F46E5",
          "primary-hover": "#4338CA",
          secondary: "#8B5CF6",
          "secondary-hover": "#7C3AED",
          border: "#E5E7EB",
          "border-light": "#F3F4F6",
          muted: "#6B7280",
        },
      },
      borderRadius: {
        card: "16px",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
