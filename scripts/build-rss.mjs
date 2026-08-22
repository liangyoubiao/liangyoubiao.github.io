// Post-build: 生成 rss.xml / atom.xml / sitemap.xml 到 dist/
// 运行时机: vite-ssg build 之后, fix-lang 之前(不需要 fix XML 文件)

import { Feed } from 'feed'
import { readFileSync, readdirSync, statSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = new URL('../', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')
const POSTS = join(ROOT, 'src/content/posts')
const DIST = join(ROOT, 'dist')
const PUBLIC_DIR = join(ROOT, 'public')

const SITE = {
  title: 'LiangYouBiao 的博客',
  description: '记录学习与生活的点滴',
  id: 'https://liangyoubiao.github.io',
  link: 'https://liangyoubiao.github.io',
  language: 'zh-CN',
  author: { name: 'LiangYouBiao', link: 'https://github.com/liangyoubiao' },
  favicon: 'https://liangyoubiao.github.io/favicon.svg',
}

// 内置简版 front-matter 解析(避免额外依赖)
function parseFrontMatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!m) return { data: {}, content: raw }
  const data = {}
  m[1].split(/\r?\n/).forEach((line) => {
    const mm = line.match(/^(\w+):\s*(.*)$/)
    if (!mm) return
    let v = mm[2].trim()
    // 数组 [a, b] / ["a", "b"]
    if (v.startsWith('[')) {
      try { v = JSON.parse(v.replace(/'([\w\s-]+)'/g, '"$1"')) } catch { v = v.slice(1, -1).split(',').map((s) => s.trim().replace(/^["']|["']$/g, '')) }
    } else if (/^\d{4}-\d{2}-\d{2}/.test(v)) {
      // 保留日期字符串
    } else {
      v = v.replace(/^["']|["']$/g, '')
    }
    data[mm[1]] = v
  })
  return { data, content: m[2] }
}

function walk(dir) {
  const out = []
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    const s = statSync(p)
    if (s.isDirectory()) out.push(...walk(p))
    else if (name.endsWith('.md')) out.push(p)
  }
  return out
}

function extractSummary(content, len = 200) {
  return content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/!?\[.*?\]\(.*?\)/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/[#>*_`~\-]+/g, '')
    .replace(/\n+/g, ' ')
    .trim()
    .substring(0, len)
}

const posts = walk(POSTS).map((p) => {
  const raw = readFileSync(p, 'utf-8')
  const { data, content } = parseFrontMatter(raw)
  const slug = p.split(/[\\/]/).pop().replace(/\.md$/, '')
  const date = data.date ? new Date(data.date) : new Date()
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return {
    title: data.title || slug,
    url: `${SITE.link}/${y}/${m}/${d}/${slug}/`,
    date,
    tags: Array.isArray(data.tags) ? data.tags : data.tags ? [data.tags] : [],
    summary: extractSummary(content),
    content,
  }
}).sort((a, b) => b.date - a.date)

console.log(`[rss] ${posts.length} posts found`)

const feed = new Feed({
  title: SITE.title,
  description: SITE.description,
  id: SITE.id,
  link: SITE.link,
  language: SITE.language,
  author: SITE.author,
  favicon: SITE.favicon,
  copyright: `© ${new Date().getFullYear()} ${SITE.author.name}`,
  feedLinks: {
    rss: `${SITE.link}/rss.xml`,
    atom: `${SITE.link}/atom.xml`,
  },
})

for (const p of posts) {
  feed.addItem({
    title: p.title,
    id: p.url,
    link: p.url,
    description: p.summary,
    content: p.content,
    date: p.date,
    category: p.tags.map((t) => ({ name: t })),
    author: [SITE.author],
  })
}

writeFileSync(join(DIST, 'rss.xml'), feed.rss2(), 'utf-8')
writeFileSync(join(DIST, 'atom.xml'), feed.atom1(), 'utf-8')

// Sitemap
const STATIC_PAGES = [
  { loc: '/', changefreq: 'weekly', priority: 1.0 },
  { loc: '/archives/', changefreq: 'weekly', priority: 0.8 },
  { loc: '/categories/', changefreq: 'weekly', priority: 0.8 },
  { loc: '/tags/', changefreq: 'weekly', priority: 0.8 },
  { loc: '/friends/', changefreq: 'monthly', priority: 0.5 },
  { loc: '/about/', changefreq: 'monthly', priority: 0.5 },
  { loc: '/contact/', changefreq: 'monthly', priority: 0.5 },
  { loc: '/demos/', changefreq: 'monthly', priority: 0.5 },
]

const urls = [
  ...STATIC_PAGES.map((p) => ({
    loc: SITE.link + p.loc,
    changefreq: p.changefreq,
    priority: p.priority,
  })),
  ...posts.map((p) => ({
    loc: p.url,
    lastmod: p.date.toISOString(),
    changefreq: 'monthly',
    priority: 0.7,
  })),
]

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    ${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`

writeFileSync(join(DIST, 'sitemap.xml'), sitemap, 'utf-8')
// robots.txt
writeFileSync(
  join(PUBLIC_DIR, 'robots.txt'),
  `User-agent: *
Allow: /

Sitemap: ${SITE.link}/sitemap.xml
`,
  'utf-8',
)

console.log(`[rss] generated rss.xml, atom.xml, sitemap.xml, public/robots.txt`)

