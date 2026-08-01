import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
// base: "./" so the built index.html uses relative asset paths — works
// whether deployed at the domain root or a sub-path (e.g. GitHub Pages
// project pages at <user>.github.io/<repo>/).
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
    sourcemap: false,
    target: "es2020",
    chunkSizeWarningLimit: 1500,
  },
});
