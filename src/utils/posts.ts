import matter from 'gray-matter'

export interface PostMeta {
  title: string
  date: string
  tags?: string[]
  categories?: string | string[]
  cover?: string
  description?: string
  slug: string
  year: string
  month: string
  day: string
  url: string
}

export interface Post extends PostMeta {
  content: string
}

// vite-ssg / Vite uses this glob to inline all .md content at build time.
const modules = import.meta.glob<string>('../content/posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
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

function parsePost(path: string, raw: string): Post {
  const parsed = matter(raw)
  const data = parsed.data as Partial<PostMeta>
  const slug = slugFromPath(path)
  const date = data.date ? new Date(data.date).toISOString() : new Date().toISOString()
  return {
    title: data.title ?? slug,
    date,
    tags: data.tags ?? [],
    categories: data.categories,
    cover: data.cover,
    description: data.description,
    slug,
    year: new Date(date).getFullYear().toString(),
    month: pad(new Date(date).getMonth() + 1),
    day: pad(new Date(date).getDate()),
    url: buildUrl(slug, date),
    content: parsed.content,
  }
}

let cached: Post[] | null = null

export function getAllPosts(): Post[] {
  if (cached) return cached
  cached = Object.entries(modules)
    .map(([path, raw]) => parsePost(path, raw))
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
