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
    https: false, // https 设置为true 线上环境应为true
    proxy: {
      '/corapi': {
        target: 'https://rebyte.ai/api/', // http://192.168.1.1:20/
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/corapi/, '') // 路径重写
      },
      // '/api': {
      //   target: 'http://39.108.51.168:3003/api/', // http://192.168.1.1:20/
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/api/, '') // 路径重写
      // },
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
