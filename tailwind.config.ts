import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1d1b16",
        cream: "#fbfaf6",
        clay: "#b95c38",
        leaf: "#3f6f4f",
        steam: "#f0eee6"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(29, 27, 22, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
