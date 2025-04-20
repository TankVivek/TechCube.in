import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: parseInt(process.env.PORT || '5173', 10),
    host: true,
    allowedHosts: ['*']  // Accept requests from any domain
  },
  preview: {
    port: parseInt(process.env.PORT || '3000', 10),
    host: true,
    allowedHosts: ['*']
  }
})
