import { fileURLToPath, URL } from 'node:url'
import { readFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import matter from 'gray-matter'

/**
 * 把 Date 对象(由 YAML !!timestamp 解析为 UTC)还原成原始字符串,
 * 避免本地时区 8h 偏移导致 URL 偏差 1 天。
 */
function fixDates(obj: any): any {
  if (obj === null || obj === undefined) return obj
  if (obj instanceof Date) {
    const y = obj.getUTCFullYear()
    const m = String(obj.getUTCMonth() + 1).padStart(2, '0')
    const d = String(obj.getUTCDate()).padStart(2, '0')
    const hh = String(obj.getUTCHours()).padStart(2, '0')
    const mm = String(obj.getUTCMinutes()).padStart(2, '0')
    const ss = String(obj.getUTCSeconds()).padStart(2, '0')
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
  }
  if (Array.isArray(obj)) return obj.map(fixDates)
  if (typeof obj === 'object') {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(obj)) out[k] = fixDates(v)
    return out
  }
  return obj
}

function mdAsData() {
  return {
    name: 'md-as-data',
    enforce: 'pre',
    transform(_code: string, id: string) {
      if (!id.endsWith('.md') || id.includes('node_modules')) return null
      const raw = readFileSync(id, 'utf-8')
      const parsed = matter(raw)
      const fixed = fixDates(parsed.data)
      const code = `export default ${JSON.stringify({
        data: fixed,
        content: parsed.content,
      })}`
      return { code, map: null }
    },
  }
}

function setHtmlLang(lang: string) {
  return {
    name: `set-html-lang-${lang}`,
    transformIndexHtml: {
      order: 'pre' as const,
      handler(html: string) {
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

