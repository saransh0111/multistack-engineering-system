import type { Config } from "tailwindcss";

export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
    "../../packages/frontend-primitives/src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {}
  },
  plugins: []
} satisfies Config;
