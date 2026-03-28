import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // Deliberately not 5173 — that is web-admin. Avoid typo vs admin URL.
    port: 5180,
    strictPort: true,
  },
});
