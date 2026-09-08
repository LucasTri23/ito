import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("firebase/firestore")) return "firestore";
          if (id.includes("node_modules") && id.includes("firebase"))
            return "firebase";
          if (
            id.includes("node_modules") &&
            (id.includes("react") || id.includes("scheduler"))
          )
            return "react";
        },
      },
    },
  },
});
