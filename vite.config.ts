import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: parseInt(process.env.PORT || '5173'),
    host: true
  },
  preview: {
    port: parseInt(process.env.PORT || '3000'),
    host: true,
    allowedHosts: ['techcube-in.onrender.com', 'techcube.in']
  }
})
