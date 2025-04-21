import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,                                // listen on all addresses
    port: parseInt(process.env.PORT || '5173', 10),
    // ❗ whitelist your Render hostname here
    allowedHosts: ['techcube-in.onrender.com'],  // :contentReference[oaicite:0]{index=0}
  },
  preview: {
    host: true,
    port: parseInt(process.env.PORT || '3000', 10),
    // ❗ same whitelist for preview mode
    allowedHosts: ['techcube-in.onrender.com'],  // :contentReference[oaicite:1]{index=1}
  }
})
