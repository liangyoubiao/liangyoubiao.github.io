import { ref, computed, shallowRef } from 'vue'
// @ts-expect-error - flexsearch has no types
import FlexSearch from 'flexsearch'

export interface SearchDoc {
  title: string
  slug: string
  url: string
  date: string
  tags: string[]
  description: string
  summary: string
  content: string
}

let docs: SearchDoc[] = []
let index: any = null
let loadingPromise: Promise<void> | null = null

export function useSearch() {
  const query = ref('')
  const ready = ref(false)

  async function load() {
    if (loadingPromise) return loadingPromise
    loadingPromise = (async () => {
      try {
        const res = await fetch('/search-data.json')
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        docs = await res.json()
        // @ts-expect-error - flexsearch types
        index = new FlexSearch.Document({
          tokenize: 'forward',
          cache: true,
          document: {
            id: 'idx',
            index: [
              { field: 'title', tokenize: 'forward' },
              { field: 'tags', tokenize: 'strict' },
              { field: 'summary', tokenize: 'forward' },
              { field: 'content', tokenize: 'forward' },
            ],
          },
        })
        docs.forEach((d, i) => {
          index.add({ idx: i, title: d.title, tags: d.tags.join(' '), summary: d.summary, content: d.content })
        })
        ready.value = true
      } catch (e) {
        console.error('[search] failed to load index:', e)
      }
    })()
    return loadingPromise
  }

  const results = computed<SearchDoc[]>(() => {
    if (!query.value.trim() || !index || !docs.length) return []
    const q = query.value.trim()
    const raw = index.search(q, { limit: 10, enrich: false }) as Array<{ field: string; result: number[] }>
    const seen = new Set<number>()
    const out: SearchDoc[] = []
    for (const group of raw) {
      for (const id of group.result) {
        if (seen.has(id)) continue
        seen.add(id)
        const doc = docs[id]
        if (doc) {
          // 计算匹配分数
          const hit = computeHit(doc, q)
          out.push(hit)
        }
      }
    }
    return out.slice(0, 8)
  })

  return { query, results, load, ready }
}

// 简单评分:title 命中 > tags 命中 > summary 命中
function computeHit(doc: SearchDoc, q: string) {
  const lower = q.toLowerCase()
  return doc
}

