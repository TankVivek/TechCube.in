import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Ensure Vite can resolve the heroicons import correctly.
      "@heroicons/react/24/outline": path.resolve(
        __dirname,
        "node_modules/@heroicons/react/24/outline"
      ),
    },
  },
  server: {
    host: true,
    port: parseInt(process.env.PORT || "5173", 10),
    allowedHosts: [
      "techcube-in.onrender.com",
      "techcube.in",
      "2c959505-5728-4a1e-9783-68ba141a402d-00-2ipu5wutlo1pt.sisko.replit.dev",
      "*",
    ],
  },
  preview: {
    host: true,
    port: parseInt(process.env.PORT || "3000", 10),
    allowedHosts: [
      "2c959505-5728-4a1e-9783-68ba141a402d-00-2ipu5wutlo1pt.sisko.replit.dev",
      "*",
    ],
  },
  optimizeDeps: {
    include: ["@heroicons/react/24/outline"],
  },
});
