<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'

interface Heading {
  level: 2 | 3
  id: string
  text: string
}

const props = defineProps<{ html: string }>()

// 从 markdown-it-anchor 加过 id 的 HTML 中提取 h2/h3
const headings = computed<Heading[]>(() => {
  if (!props.html) return []
  const re = /<h([23])[^>]*?id="([^"]+)"[^>]*?>([\s\S]*?)<\/h\1>/g
  const out: Heading[] = []
  let m: RegExpExecArray | null
  while ((m = re.exec(props.html)) !== null) {
    const level = Number(m[1]) as 2 | 3
    const id = m[2]
    // 去掉内部 <a> 标签,只留纯文本
    const inner = m[3].replace(/<a[^>]*>[\s\S]*?<\/a>/g, '').replace(/<[^>]+>/g, '').trim()
    out.push({ level, id, text: inner })
  }
  return out
})

const activeId = ref<string>('')
let observer: IntersectionObserver | null = null

function setupObserver() {
  if (observer) observer.disconnect()
  if (!headings.value.length) return

  const targets = headings.value
    .map((h) => document.getElementById(h.id))
    .filter((el): el is HTMLElement => !!el)

  observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
      if (visible[0]) {
        activeId.value = visible[0].target.id
      }
    },
    {
      rootMargin: '-80px 0px -70% 0px',
      threshold: 0,
    },
  )
  targets.forEach((t) => observer!.observe(t))
}

onMounted(() => {
  // 等下一帧确保 DOM 渲染完成
  requestAnimationFrame(() => setupObserver())
})

onBeforeUnmount(() => {
  observer?.disconnect()
})

function go(id: string, e: Event) {
  e.preventDefault()
  const el = document.getElementById(id)
  if (!el) return
  const y = el.getBoundingClientRect().top + window.scrollY - 80
  window.scrollTo({ top: y, behavior: 'smooth' })
  history.replaceState(null, '', `#${id}`)
}
</script>

<template>
  <aside v-if="headings.length" class="toc-sidebar">
    <h3 class="toc-title">📑 文章目录</h3>
    <ul class="toc-list">
      <li
        v-for="h in headings"
        :key="h.id"
        :class="['toc-item', `toc-h${h.level}`, h.id === activeId && 'is-active']"
      >
        <a :href="`#${h.id}`" :title="h.text" @click="go(h.id, $event)">{{ h.text }}</a>
      </li>
    </ul>
  </aside>
</template>

<style scoped>
.toc-sidebar {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(50, 50, 93, .08), 0 4px 10px rgba(0, 0, 0, .05);
  padding: 1rem 1rem 1.25rem;
  font-size: 0.85rem;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
  /* sticky 由父 .post-toc-col 提供,自身无需再 sticky */
}

.toc-title {
  font-size: 0.95rem;
  margin: 0 0 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #f0f0f0;
  color: var(--matery-text);
  font-weight: 600;
}

.toc-list {
  list-style: none;
  margin: 0;
  padding: 0;
  border-left: 2px solid #f0f0f0;
}

.toc-item {
  margin: 0;
  border-left: 2px solid transparent;
  margin-left: -2px;
}

.toc-item a {
  display: block;
  padding: 0.35rem 0.6rem;
  color: #666;
  text-decoration: none;
  line-height: 1.5;
  transition: color 0.2s, background 0.2s, border-color 0.2s, font-weight 0.2s;
  border-left: 2px solid transparent;
  margin-left: -2px;
  /* 长标题/CJK 不在单词内断行,而是按词换行 */
  word-break: break-word;
  overflow-wrap: anywhere;
}

.toc-item a:hover {
  color: var(--matery-primary);
}

.toc-h3 a {
  padding-left: 1.25rem;
  font-size: 0.78rem;
  color: #999;
}

.toc-item.is-active > a,
.toc-item.is-active a {
  color: var(--matery-primary);
  font-weight: 600;
  border-left-color: var(--matery-primary);
  background: linear-gradient(90deg, rgba(15, 157, 88, 0.06), transparent);
}

@media (max-width: 1100px) {
  .toc-sidebar { display: none; }
}
</style>

