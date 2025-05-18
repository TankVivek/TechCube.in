import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
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
});
