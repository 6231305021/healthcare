import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// นี่คือการตั้งค่าที่แก้ไขแล้วเพื่อบังคับให้ Vite ใช้ Vue เวอร์ชันที่มี Compiler
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // 🚨 การแก้ไข: เพิ่ม alias สำหรับ 'vue' เพื่อใช้ Full Build ที่รองรับการคอมไพล์ Template
      'vue': 'vue/dist/vue.esm-bundler.js',
      '@': path.resolve(__dirname, './src'),
    },
  },
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
