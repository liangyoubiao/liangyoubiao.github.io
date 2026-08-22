export interface PostMeta {
  title: string
  date: string
  tags?: string[]
  categories?: string | string[]
  cover?: string
  description?: string
  top?: boolean
  slug: string
  year: string
  month: string
  day: string
  url: string
}

export interface Post extends PostMeta {
  content: string
}

interface PostModule {
  data: Record<string, unknown>
  content: string
}

// 由 vite.config.ts 中的 mdAsData 插件预解析:
// gray-matter 只在 Node 端运行,浏览器端拿到的是纯数据对象。
// import: 'default' 让 glob 直接吐默认导出,避免模块命名空间包装。
const modules = import.meta.glob<PostModule>('../content/posts/*.md', {
  eager: true,
  import: 'default',
})

function slugFromPath(path: string): string {
  const file = path.split('/').pop() || ''
  return file.replace(/\.md$/, '')
}

function pad(n: number): string {
  return n.toString().padStart(2, '0')
}

function buildUrl(slug: string, date: string): string {
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) {
    return `/posts/${slug}/`
  }
  const y = d.getFullYear().toString()
  const m = pad(d.getMonth() + 1)
  const day = pad(d.getDate())
  return `/${y}/${m}/${day}/${slug}/`
}

function isTrue(v: unknown): boolean {
  return v === true || v === 'true' || v === '是' || v === 1
}

function parsePost(path: string, mod: PostModule): Post {
  const data = mod.data
  const slug = slugFromPath(path)
  const rawDate = data.date
  const date = rawDate
    ? new Date(typeof rawDate === 'string' ? rawDate : String(rawDate)).toISOString()
    : new Date().toISOString()
  return {
    title: (data.title as string) ?? slug,
    date,
    tags: (data.tags as string[]) ?? [],
    categories: data.categories as string | string[] | undefined,
    cover: data.cover as string | undefined,
    description: data.description as string | undefined,
    top: isTrue(data.top),
    slug,
    year: new Date(date).getFullYear().toString(),
    month: pad(new Date(date).getMonth() + 1),
    day: pad(new Date(date).getDate()),
    url: buildUrl(slug, date),
    content: mod.content,
  }
}

let cached: Post[] | null = null

export function getAllPosts(): Post[] {
  if (cached) return cached
  cached = Object.entries(modules)
    .map(([path, mod]) => parsePost(path, mod))
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
  return cached
}

export function getAllTags(posts: Post[] = getAllPosts()): string[] {
  const set = new Set<string>()
  posts.forEach((p) => p.tags?.forEach((t) => set.add(t)))
  return [...set].sort()
}

export function getPostsByTag(tag: string): Post[] {
  return getAllPosts().filter((p) => p.tags?.includes(tag))
}

export function getRecommendedPosts(): Post[] {
  return getAllPosts().filter((p) => p.top)
}

export function getPostsByYearMonth(): Record<string, Record<string, Post[]>> {
  const grouped: Record<string, Record<string, Post[]>> = {}
  for (const post of getAllPosts()) {
    const y = post.year
    const m = post.month
    grouped[y] ??= {}
    grouped[y][m] ??= []
    grouped[y][m].push(post)
  }
  return grouped
}

