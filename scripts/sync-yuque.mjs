// 语雀图片自动同步:扫描 src/content/posts/*.md,
// 下载 https://cdn.nlark.com/yuque/* 图片到 public/images/yuque/,
// 把 .md 里的远程 URL 改写成 /images/yuque/<file>。
// 幂等:已下载的图跳过下载,URL 替换一次后稳定。
//
// 用法:
//   手动:   node scripts/sync-yuque.mjs
//   自动:   在 package.json 加 "prebuild": "node scripts/sync-yuque.mjs"
//
// 离线时: 下载失败跳过,build 仍能继续(已替换的 URL 仍生效)。

import { readFile, writeFile, mkdir, stat, readdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, basename } from 'node:path'
import { fileURLToPath } from 'node:url'
import https from 'node:https'
import http from 'node:http'

const ROOT = fileURLToPath(new URL('../', import.meta.url))
const POSTS_DIR = join(ROOT, 'src/content/posts')
const IMG_DIR = join(ROOT, 'public/images/yuque')

const YUQUE_IMG_RE = /https?:\/\/cdn\.nlark\.com\/yuque\/[^)\s]+\.(jpe?g|png|gif|webp)(\?[^)\s]*)?/g

await mkdir(IMG_DIR, { recursive: true })

let scanned = 0
let downloads = 0
let skipped = 0
let failed = 0
let replaced = 0

function fetchToFile(url, dest) {
  return new Promise((resolve) => {
    const lib = url.startsWith('https:') ? https : http
    const req = lib.get(
      url,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Referer: 'https://www.yuque.com/',
        },
        timeout: 15000,
      },
      (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          // 跟随重定向
          fetchToFile(res.headers.location, dest).then(resolve)
          return
        }
        if (res.statusCode !== 200) {
          console.error(`  ❌ HTTP ${res.statusCode} ${url}`)
          res.resume()
          failed++
          resolve(false)
          return
        }
        const chunks = []
        res.on('data', (c) => chunks.push(c))
        res.on('end', async () => {
          try {
            const buf = Buffer.concat(chunks)
            const { writeFile } = await import('node:fs/promises')
            await writeFile(dest, buf)
            resolve(true)
          } catch (e) {
            console.error(`  ❌ 写文件失败: ${e.message}`)
            failed++
            resolve(false)
          }
        })
        res.on('error', (e) => {
          console.error(`  ❌ 下载失败 ${url}: ${e.message}`)
          failed++
          resolve(false)
        })
      },
    )
    req.on('error', (e) => {
      console.error(`  ❌ 请求失败 ${url}: ${e.message}`)
      failed++
      resolve(false)
    })
    req.on('timeout', () => {
      console.error(`  ❌ 超时 ${url}`)
      req.destroy()
      failed++
      resolve(false)
    })
  })
}

function extractFilename(url) {
  // 拿路径最后一段,去掉 query
  const noQuery = url.split('?')[0]
  return basename(noQuery)
}

async function processPost(file) {
  if (!file.endsWith('.md')) return
  const full = join(POSTS_DIR, file)
  const original = await readFile(full, 'utf-8')
  const urls = [...new Set([...original.matchAll(YUQUE_IMG_RE)].map((m) => m[0]))]
  if (urls.length === 0) return
  scanned++

  console.log(`\n📄 ${file}  (${urls.length} 张语雀图)`)
  let content = original

  for (const url of urls) {
    const filename = extractFilename(url)
    const localPath = join(IMG_DIR, filename)
    const localUrl = `/images/yuque/${filename}`

    if (existsSync(localPath)) {
      skipped++
      console.log(`  ℹ️ 已存在,跳过下载: ${filename}`)
    } else {
      console.log(`  📥 下载: ${url}`)
      const ok = await fetchToFile(url, localPath)
      if (ok) {
        downloads++
        console.log(`  ✅ 保存: ${localPath}`)
      } else {
        continue  // 下载失败,不替换 URL
      }
    }

    // 替换 .md 里的远程 URL(含 ?query)
    const re = new RegExp(url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
    const before = content.length
    content = content.replace(re, localUrl)
    if (content.length !== before) replaced++
  }

  if (content !== original) {
    await writeFile(full, content, 'utf-8')
    console.log(`  💾 更新: ${file}`)
  }
}

const files = await readdir(POSTS_DIR)
for (const f of files) {
  await processPost(f)
}

console.log(`\n[yuque] 扫描 ${scanned} 篇文章  下载 ${downloads} 张  跳过 ${skipped} 张  失败 ${failed} 张  替换 ${replaced} 处`)

