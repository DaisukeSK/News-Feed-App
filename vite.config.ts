import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    emptyOutDir: true,
    outDir: "./dist",
    rollupOptions: {
      input: {
        api: path.resolve(__dirname, "src/main.ts"),
      },
    },
    ssr: true,
  },
  ssr: {
    noExternal: true,
    target: "node",
  },
  server: {
    proxy: {
      "/api": {
        target: "https://dnn-2024.vercel.app/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
