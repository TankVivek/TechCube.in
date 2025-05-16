import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: parseInt(process.env.PORT || '5173', 10),
    allowedHosts: [
      'techcube-in.onrender.com', 
      'techcube.in'
    ],
  },
  preview: {
    host: true,
    port: parseInt(process.env.PORT || '3000', 10),
    allowedHosts: [
      'techcube-in.onrender.com',
      'techcube.in'
    ],
  }
})
