const FEATURE_COUNT = 24

function hash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h) + s.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

/**
 * 从 markdown 正文里提取图片 URL,忽略代码块和行内代码。
 * 匹配语法: ![alt](url) 或 ![alt](url "title")
 */
export function extractInlineImages(md: string): string[] {
  const cleaned = md
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`\n]+`/g, '')
  const images: string[] = []
  const re = /!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g
  let m: RegExpExecArray | null
  while ((m = re.exec(cleaned)) !== null) {
    images.push(m[1])
  }
  return images
}

/**
 * 给一篇文章选封面图。
 * 候选项:frontmatter cover(若有) + 正文内联图片(去重)。
 * 都没有时回退到 /medias/featureimages/。
 *
 * random=false(默认)→ 用 hash 取稳定的一张,适合 SSR / 首屏(避免 hydration mismatch)。
 * random=true → 用 Math.random 随机抽,适合客户端挂载后。
 */
export function pickArticleCover(
  content: string,
  slug: string,
  explicitCover: string | undefined,
  random: boolean,
): string {
  const pool: string[] = []
  if (explicitCover) pool.push(explicitCover)
  for (const url of extractInlineImages(content)) {
    if (!pool.includes(url)) pool.push(url)
  }
  if (pool.length > 0) {
    const i = random
      ? Math.floor(Math.random() * pool.length)
      : hash(slug) % pool.length
    return pool[i]
  }
  const i = random
    ? Math.floor(Math.random() * FEATURE_COUNT)
    : hash(slug) % FEATURE_COUNT
  return `/medias/featureimages/${i}.webp`
}