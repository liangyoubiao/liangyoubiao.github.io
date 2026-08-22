import { fileURLToPath, URL } from 'node:url'
import { readFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import matter from 'gray-matter'

/**
 * Vite plugin: 把 .md 文件 import 转换成预解析的 { data, content } JS 模块。
 * 这样 gray-matter 只在 Node 端运行(构建时),浏览器端不会触发 Buffer 缺失错误。
 */
function mdAsData() {
  return {
    name: 'md-as-data',
    enforce: 'pre',
    transform(_code, id) {
      if (!id.endsWith('.md') || id.includes('node_modules')) return null
      const raw = readFileSync(id, 'utf-8')
      const parsed = matter(raw)
      const code = `export default ${JSON.stringify({
        data: parsed.data,
        content: parsed.content,
      })}`
      return { code, map: null }
    },
  }
}

/**
 * 在构建时把 index.html 的 <html lang="..."> 强制改为指定值,
 * 备用方案:实际由 post-build 脚本 scripts/fix-lang.mjs 完成。
 */
function setHtmlLang(lang) {
  return {
    name: `set-html-lang-${lang}`,
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return html.replace(
          /<html(\s[^>]*)?>/i,
          (match, attrs) => {
            const a = attrs || ' '
            if (/lang=/i.test(a)) {
              return '<html' + a.replace(/lang="[^"]*"/i, 'lang="' + lang + '"') + '>'
            }
            return `<html${a} lang="${lang}">`
          },
        )
      },
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), mdAsData(), setHtmlLang('zh-CN')],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  base: '/',
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: false,
  },
  preview: {
    host: '127.0.0.1',
    port: 5050,
    strictPort: false,
  },
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
    crittersOptions: false,
  },
})

