import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const targetBackend = env.VITE_API_BASE_URL || 'https://clubsphere-9w89.onrender.com'

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: targetBackend,
          changeOrigin: true,
          secure: true,
        },
        '/socket.io': {
          target: targetBackend,
          ws: true,
          changeOrigin: true,
          secure: true,
        },
      },
    },
  }
})

