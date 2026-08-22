// Post-build script: rewrite <html lang="..."> to "zh-CN" in all generated HTML files.
// vite-ssg does not run Vite transformIndexHtml during prerender, so we patch after build.

import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { join, extname } from 'node:path'

const DIST = new URL('../dist/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')
const TARGET_LANG = 'zh-CN'
let patched = 0
let scanned = 0

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    const s = statSync(p)
    if (s.isDirectory()) {
      walk(p)
    } else if (extname(name) === '.html') {
      scanned++
      let html = readFileSync(p, 'utf8')
      const before = html
      html = html.replace(
        /<html(\s[^>]*)?>/i,
        (match, attrs) => {
          const a = attrs || ' '
          if (/lang=/i.test(a)) {
            return '<html' + a.replace(/lang="[^"]*"/i, `lang="${TARGET_LANG}"`) + '>'
          }
          return `<html${a} lang="${TARGET_LANG}">`
        },
      )
      if (html !== before) {
        writeFileSync(p, html, 'utf8')
        patched++
      }
    }
  }
}

walk(DIST)
console.log(`[fix-lang] scanned ${scanned} HTML files, patched ${patched}`)

