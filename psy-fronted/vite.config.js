import { fileURLToPath, URL } from 'node:url'
import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), 'src'),
    }
  },
  server: {
    host: '0.0.0.0',
    port: 3008,
    open: true,
    strictPort: false,
    https: false, 
    proxy: {
      '/corapi': {
        target: 'https://rebyte.ai/api/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/corapi/, '') // 路径重写
      },
    }
  },
  build: {
    reportCompressedSize: false,
    sourcemap: false,
    commonjsOptions: {
      ignoreTryCatch: false,
    },
  },
})
