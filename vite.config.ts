import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "path"; // ← Обязательно добавь это

export default defineConfig({
  plugins: [react(), svgr({})],

  base: "/rocket-casino-project/", // ← Это правильно для твоего деплоя на Vercel

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),         // @ → папка src
      "@assets": path.resolve(__dirname, "./assets"), // @assets → папка assets в корне
    },
  },
});