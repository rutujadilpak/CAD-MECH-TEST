import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  // Base path for GitHub Pages deployment
  base: process.env.NODE_ENV === 'production' ? '/CAD-MECH-TEST/' : '/',

  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})