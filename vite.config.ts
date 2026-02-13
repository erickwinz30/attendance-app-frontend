import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:8080",
      // "/api": "https://68w13bm6-8080.asse.devtunnels.ms/",
    },
  },
});
