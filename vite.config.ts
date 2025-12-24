import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react(), svgr({})],

  resolve: {
    alias: [
      {
        find: /^@\/assets\//,
        replacement: fileURLToPath(new URL("./src/assets/", import.meta.url)),
      },
      { find: /^@\//, replacement: fileURLToPath(new URL("./src/", import.meta.url)) },
    ],
  },

  base: "/rocket-casino-project/",
});
