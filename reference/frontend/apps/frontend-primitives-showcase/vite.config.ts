import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: "@multistack/frontend-primitives/styles.css",
        replacement: new URL(
          "../../packages/frontend-primitives/src/styles.css",
          import.meta.url
        ).pathname
      },
      {
        find: "@multistack/frontend-primitives",
        replacement: new URL(
          "../../packages/frontend-primitives/src/index.ts",
          import.meta.url
        ).pathname
      }
    ]
  }
});
