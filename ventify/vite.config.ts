import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    outDir: "dist",
  },
  // This part handles SPA fallback for React Router
  preview: {
    port: 5000,
    strictPort: true,
    proxy: {
      "/api": "http://localhost:4000", // example API proxy (if needed)
    },
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  // Add this to handle SPA fallback
  base: "/",
  esbuild: {},
});
