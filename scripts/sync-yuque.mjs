// 语雀图片自动同步:扫描 src/content/posts/*.md,
// 把每篇 md 的 https://cdn.nlark.com/yuque/* 图片下载到
//   public/images/yuque/<md文件名(去 .md)>/
// 并把 .md 里的远程 URL 改写为 /images/yuque/<md文件名>/<file>。
// 幂等:已下载的图跳过,URL 替换一次后稳定。
//
// 触发方式:
//   npm run dev       → vite 插件(dev server 启动时全量同步,md 变更时增量同步)
//   npm run build     → prebuild 钩子
//   npm run sync:images → 手动全量同步
//
// 行为约定:
//   - 代码块里的 URL(文档示例)跳过,不做无谓的下载请求
//   - 并发下载,默认 8 路
//   - 写入前二次校验,避免覆盖同步期间用户对 md 的改动

import { readFile, writeFile, mkdir, readdir, rmdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, basename } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import https from 'node:https'
import http from 'node:http'

const ROOT = fileURLToPath(new URL('../', import.meta.url))
const POSTS_DIR = join(ROOT, 'src/content/posts')
const IMG_ROOT = join(ROOT, 'public/images/yuque')

const YUQUE_IMG_RE = /https?:\/\/cdn\.nlark\.com\/yuque\/[^\s)"']+?\.(?:jpe?g|png|gif|webp)(?:\?[^\s)"']*)?/g
const FENCE_RE = /^\s*(`{3,}|~{3,})/

// 把内容切成「代码块 / 非代码块」片段,原文可由片段用 '\n' 拼回
export function splitFencedBlocks(content) {
  const segments = []
  let buffer = []
  let fence = null

  const flush = (code) => {
    segments.push({ code, text: buffer.join('\n') })
    buffer = []
  }

  for (const line of content.split('\n')) {
    const m = line.match(FENCE_RE)
    if (!fence) {
      if (m) {
        flush(false)
        fence = { char: m[1][0], len: m[1].length }
      }
      buffer.push(line)
    } else {
      buffer.push(line)
      if (m && m[1][0] === fence.char && m[1].length >= fence.len) {
        flush(true)
        fence = null
      }
    }
  }
  flush(fence !== null)
  return segments
}

export function extractYuqueUrls(content) {
  const urls = new Set()
  for (const seg of splitFencedBlocks(content)) {
    if (seg.code) continue
    for (const m of seg.text.matchAll(YUQUE_IMG_RE)) urls.add(m[0])
  }
  return [...urls]
}

function rewriteUrls(content, replacements) {
  const segments = splitFencedBlocks(content)
  for (const seg of segments) {
    if (seg.code) continue
    let text = seg.text
    for (const [from, to] of replacements) text = text.split(from).join(to)
    seg.text = text
  }
  return segments.map((s) => s.text).join('\n')
}

function download(url, dest, redirects = 0) {
  return new Promise((resolve) => {
    const lib = url.startsWith('https:') ? https : http
    const req = lib.get(
      url,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Referer: 'https://www.yuque.com/',
        },
        timeout: 20000,
      },
      (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          res.resume()
          if (redirects >= 5) return resolve(false)
          return resolve(download(new URL(res.headers.location, url).href, dest, redirects + 1))
        }
        if (res.statusCode !== 200) {
          res.resume()
          return resolve(false)
        }
        const chunks = []
        res.on('data', (c) => chunks.push(c))
        res.on('end', async () => {
          try {
            await writeFile(dest, Buffer.concat(chunks))
            resolve(true)
          } catch {
            resolve(false)
          }
        })
        res.on('error', () => resolve(false))
      },
    )
    req.on('error', () => resolve(false))
    req.on('timeout', () => {
      req.destroy()
      resolve(false)
    })
  })
}

async function runPool(items, limit, worker) {
  let cursor = 0
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      await worker(items[cursor++])
    }
  })
  await Promise.all(runners)
}

// 删掉空目录(某篇图的下载全失败时会留下空壳)
async function cleanupEmptyDirs(root) {
  if (!existsSync(root)) return
  for (const name of await readdir(root)) {
    const dir = join(root, name)
    try {
      if ((await readdir(dir)).length === 0) await rmdir(dir)
    } catch {
      // 不是目录或已被清理,忽略
    }
  }
}

export async function syncYuque(options = {}) {
  const {
    postsDir = POSTS_DIR,
    imgRoot = IMG_ROOT,
    concurrency = 8,
    files = null,
    quiet = false,
  } = options

  const log = (...args) => {
    if (!quiet) console.log(...args)
  }

  let names = (await readdir(postsDir)).filter((n) => n.endsWith('.md'))
  if (files) {
    const wanted = new Set(files)
    names = names.filter((n) => wanted.has(n))
  }

  let downloaded = 0
  let skipped = 0
  let failed = 0
  let replaced = 0
  let changedFiles = 0

  for (const file of names) {
    const slug = file.replace(/\.md$/, '')
    const full = join(postsDir, file)
    const original = await readFile(full, 'utf-8')
    const urls = extractYuqueUrls(original)
    if (urls.length === 0) continue

    const postImgDir = join(imgRoot, slug)
    const replacements = []
    const pending = []

    for (const url of urls) {
      const filename = basename(url.split('?')[0])
      const localPath = join(postImgDir, filename)
      const localUrl = `/images/yuque/${slug}/${filename}`
      if (existsSync(localPath)) {
        skipped++
        replacements.push([url, localUrl])
      } else {
        pending.push({ url, localPath, localUrl, filename })
      }
    }

    if (pending.length > 0) {
      await mkdir(postImgDir, { recursive: true })
      log(`\n📄 ${file}  (待下载 ${pending.length} 张 → public/images/yuque/${slug}/)`)
      await runPool(pending, concurrency, async (item) => {
        if (await download(item.url, item.localPath)) {
          downloaded++
          replacements.push([item.url, item.localUrl])
          log(`  ✅ ${item.filename}`)
        } else {
          failed++
          log(`  ❌ ${item.filename}  ${item.url}`)
        }
      })
    }

    if (replacements.length === 0) continue

    const content = rewriteUrls(original, replacements)
    if (content === original) continue

    // 同步期间用户改了 md,放弃本次写入,避免覆盖
    const latest = await readFile(full, 'utf-8')
    if (latest !== original) {
      log(`  ⚠️ ${file} 在同步期间被修改,跳过写入(下次同步会重试)`)
      continue
    }

    await writeFile(full, content, 'utf-8')
    replaced += replacements.length
    changedFiles++
    log(`  💾 ${file}`)
  }

  await cleanupEmptyDirs(imgRoot)

  const summary = `[yuque] 扫描 ${names.length} 篇 · 下载 ${downloaded} · 已存在 ${skipped} · 失败 ${failed} · 改写 ${replaced} 处 / ${changedFiles} 个文件`
  log(summary)
  return { downloaded, skipped, failed, replaced, changedFiles }
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href
if (isMain) {
  const argv = process.argv.slice(2)
  const fileArgs = argv.filter((a) => a.startsWith('--file=')).map((a) => a.slice('--file='.length))
  syncYuque({
    files: fileArgs.length > 0 ? fileArgs : null,
    quiet: argv.includes('--quiet'),
  }).catch((e) => {
    console.error('[yuque] 同步失败:', e.message)
    process.exit(1)
  })
}
