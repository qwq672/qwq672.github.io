import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// https://vitejs.dev/config/
// `base: './'` makes all asset URLs relative so the build works whether it's
// served from the root (Cloudflare Pages custom domain) or a sub-path
// (GitHub Pages project site at https://<user>.github.io/<repo>/).
export default defineConfig({
  base: "./",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
    chunkSizeWarningLimit: 1200,
  },
});
