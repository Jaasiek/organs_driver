// vite.config.js
import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

export default defineConfig({
  plugins: [preact()],
  server: {
    host: true, // 👈 UMOŻLIWIA dostęp przez IP z sieci lokalnej
    port: 5173, // 👈 (opcjonalnie) port, na którym działa
  },
});
