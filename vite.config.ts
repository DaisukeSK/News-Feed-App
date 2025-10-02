import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    cors: false,
    proxy: {
      "/random_joke": {
        target: "*",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react()],
});
