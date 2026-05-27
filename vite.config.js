import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/sanity': {
        target: 'https://8l58hmsi.api.sanity.io',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/sanity/, ''),
      },
    },
  },
})
