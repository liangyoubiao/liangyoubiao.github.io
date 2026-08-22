// Image compression script: convert all jpg/jpeg/png in public/ to webp, replace originals.
// Run manually when adding new images or when size grows too much.
//
// Usage: node scripts/compress-images.mjs [quality]
//   quality: 1-100, default 80 (good balance)

import { readdir, stat, writeFile, readFile, unlink } from 'node:fs/promises'
import { join, extname, dirname, basename } from 'node:path'
import sharp from 'sharp'

const ROOT = new URL('../', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')
const PUBLIC = join(ROOT, 'public')
const QUALITY = Number(process.argv[2]) || 80
const EXTS = new Set(['.jpg', '.jpeg', '.png'])

let totalBefore = 0
let totalAfter = 0
let count = 0

async function walk(dir) {
  for (const name of await readdir(dir)) {
    const p = join(dir, name)
    const s = await stat(p)
    if (s.isDirectory()) {
      await walk(p)
    } else if (EXTS.has(extname(name).toLowerCase())) {
      await convert(p)
    }
  }
}

async function convert(file) {
  const before = (await stat(file)).size
  totalBefore += before
  const dir = dirname(file)
  const base = basename(file, extname(file))
  const out = join(dir, base + '.webp')

  const data = await readFile(file)
  const img = sharp(data)
  const meta = await img.metadata()
  // 保持原方向(EXIF)与格式质量
  await img
    .rotate() // 根据 EXIF 旋转
    .webp({ quality: QUALITY, effort: 4 })
    .toFile(out)

  const after = (await stat(out)).size
  totalAfter += after

  // 删除原文件,只用 .webp
  await unlink(file)

  const ratio = ((1 - after / before) * 100).toFixed(1)
  const w = meta.width || '?'
  console.log(
    `  ${basename(file).padEnd(30)} ${(before / 1024).toFixed(0).padStart(6)} KB -> ${(after / 1024).toFixed(0).padStart(6)} KB  (-${ratio}%)  ${w}×${meta.height}'?'`,
  )
  count++
}

console.log(`[compress] quality=${QUALITY}, target: webp\n`)
await walk(PUBLIC)

const beforeMB = (totalBefore / 1024 / 1024).toFixed(2)
const afterMB = (totalAfter / 1024 / 1024).toFixed(2)
const ratio = ((1 - totalAfter / totalBefore) * 100).toFixed(1)
console.log(`\n[compress] done: ${count} files`)
console.log(`[compress] before: ${beforeMB} MB  ->  after: ${afterMB} MB  (-${ratio}%)`)

