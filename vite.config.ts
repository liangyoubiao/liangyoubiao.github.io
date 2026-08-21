import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // GitHub Pages user site uses root base; if migrating to project page later,
  // change to '/<repo-name>/'.
  base: '/',
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
    crittersOptions: false,
  },
})
