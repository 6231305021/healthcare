import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: path.resolve(__dirname, '../dist'), // ⚡ เอา dist ไว้ตรง backend root
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`
      }
    },
    target: 'es2020' // ⚡ รองรับ Top-level await, modern browsers
  },
  base: './', // ⚡ relative path เพื่อให้ Railway serve index.html + assets
})
