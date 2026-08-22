<script setup lang="ts">
import { computed } from 'vue'
import type { Post } from '@/utils/posts'

const props = defineProps<{ post: Post }>()

const COVER_GRADIENTS = [
  'linear-gradient(135deg, #4cbf30 0%, #0f9d58 100%)',
  'linear-gradient(135deg, #00b4db 0%, #0083b0 100%)',
  'linear-gradient(135deg, #f857a6 0%, #ff5858 100%)',
  'linear-gradient(135deg, #5b86e5 0%, #36d1dc 100%)',
  'linear-gradient(135deg, #ff9966 0%, #ff5e62 100%)',
  'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
  'linear-gradient(135deg, #c471f5 0%, #fa71cd 100%)',
  'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
  'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
  'linear-gradient(135deg, #642b73 0%, #c6426e 100%)',
]

function hash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h) + s.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

const gradient = computed(() => COVER_GRADIENTS[hash(props.post.slug) % COVER_GRADIENTS.length])

const summary = computed(() => {
  const text = (props.post.description || extractSummary(props.post.content)).trim()
  return text.length > 90 ? text.substring(0, 90) + '…' : text
})

function extractSummary(md: string): string {
  const stripped = md
    .replace(/```[\s\S]*?```/g, '')
    .replace(/!?\[.*?\]\(.*?\)/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/[#>*_`~\-]+/g, '')
    .replace(/\n+/g, ' ')
    .trim()
  return stripped
}

const dateText = computed(() => {
  const d = new Date(props.post.date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
})
</script>

<template>
  <article class="matery-card">
    <RouterLink :to="post.url" class="card-image" :aria-label="post.title">
      <div class="gradient" :style="{ background: gradient }"></div>
      <h3 class="card-title">{{ post.title }}</h3>
    </RouterLink>
    <div class="card-content">
      <div class="card-meta">
        <i class="far fa-calendar-alt"></i>
        <time>{{ dateText }}</time>
        <span v-if="post.tags?.length" style="margin-left: 0.5rem">
          <i class="fas fa-tag"></i>
          <span v-for="(t, i) in post.tags.slice(0, 2)" :key="t" class="mini-tag">
            {{ t }}<span v-if="i < Math.min(post.tags.length, 2) - 1">,</span>
          </span>
        </span>
      </div>
      <p class="card-summary">{{ summary }}</p>
      <div class="card-footer">
        <RouterLink :to="post.url" class="read-more">阅读全文 →</RouterLink>
      </div>
    </div>
  </article>
</template>

<style scoped>
.card-image {
  display: block;
  text-decoration: none;
  color: inherit;
}

.mini-tag {
  color: var(--matery-primary);
  margin-left: 0.15rem;
}
</style>

