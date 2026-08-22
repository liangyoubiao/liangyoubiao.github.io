<script setup lang="ts">
import { computed } from 'vue'
import type { Post } from '@/utils/posts'

const props = defineProps<{ post: Post }>()

// 24 张 featureimage(从老 matery 主题 /medias/featureimages/ 迁移)
const FEATURE_COUNT = 24

// 6 套渐变占位(老 matery 的 fallback)
const GRADIENTS = [
  'linear-gradient(135deg, #FF5E3A 0%, #FF2A68 100%)',
  'linear-gradient(135deg, #EF4DB6 0%, #C643FC 100%)',
  'linear-gradient(135deg, #1AD6FD 0%, #1D62F0 100%)',
  'linear-gradient(135deg, #4cbf30 0%, #0f9d58 100%)',
  'linear-gradient(135deg, #C644FC 0%, #5856D6 100%)',
  'linear-gradient(135deg, #55EFCB 0%, #5BCAFF 100%)',
]

function hash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h) + s.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

const cover = computed(() => {
  if (props.post.cover) return props.post.cover
  return `/medias/featureimages/${hash(props.post.slug) % FEATURE_COUNT}.webp`
})

const gradient = computed(() => GRADIENTS[hash(props.post.slug) % GRADIENTS.length])

const summary = computed(() => {
  const text = (props.post.description || extractSummary(props.post.content)).trim()
  return text.length > 90 ? text.substring(0, 90) + '…' : text
})

function extractSummary(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, '')
    .replace(/!?\[.*?\]\(.*?\)/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/[#>*_`~\-]+/g, '')
    .replace(/\n+/g, ' ')
    .trim()
}

const dateText = computed(() => {
  const d = new Date(props.post.date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
})

// 背景样式:图片 + 渐变 fallback(双层背景,图片加载失败时显示渐变)
const bgStyle = computed(() => ({
  background: `url(${cover.value}) center/cover no-repeat, ${gradient.value}`,
}))

// 标题悬浮样式(只显示前 2 行)
</script>

<template>
  <article class="matery-card">
    <RouterLink :to="post.url" class="card-image" :aria-label="post.title">
      <div class="card-bg" :style="bgStyle" />
      <h3 class="card-title">{{ post.title }}</h3>
      <span v-if="post.tags?.length" class="card-badge">
        {{ post.tags[0] }}
      </span>
    </RouterLink>
    <div class="card-content">
      <div class="card-meta">
        <i class="far fa-calendar-alt"></i>
        <time>{{ dateText }}</time>
        <span v-if="post.tags?.length" class="meta-tags">
          <i class="fas fa-tag"></i>
          <RouterLink
            v-for="(t, i) in post.tags.slice(0, 3)"
            :key="t"
            :to="`/tags/${encodeURIComponent(t)}/`"
            class="mini-tag"
          >#{{ t }}<span v-if="i < Math.min(post.tags.length, 3) - 1">, </span></RouterLink>
        </span>
      </div>
      <p class="card-summary">{{ summary }}</p>
      <div class="card-footer">
        <RouterLink :to="post.url" class="read-more">阅读全文 →</RouterLink>
        <span class="read-time"><i class="far fa-clock"></i> {{ Math.max(1, Math.ceil(post.content.length / 400)) }} 分钟</span>
      </div>
    </div>
  </article>
</template>

<style scoped>
.card-image {
  position: relative;
  display: block;
  text-decoration: none;
  color: inherit;
  overflow: hidden;
}

.card-bg {
  height: 200px;
  position: relative;
  transition: transform 0.5s ease;
  transform-origin: center;
}

.matery-card:hover .card-bg {
  transform: scale(1.08);
}

.card-bg::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0.65) 100%);
  pointer-events: none;
  z-index: 1;
}

.card-title {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem 1.25rem;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1.35;
  margin: 0;
  z-index: 2;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
}

.card-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(255, 255, 255, 0.92);
  color: #2c3e50;
  font-size: 0.72rem;
  padding: 4px 10px;
  border-radius: 999px;
  z-index: 2;
  font-weight: 500;
  backdrop-filter: blur(2px);
}

.card-content {
  padding: 1.1rem 1.5rem 1.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-meta {
  color: #999;
  font-size: 0.78rem;
  margin-bottom: 0.4rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.card-meta i { margin-right: 0.25rem; }

.meta-tags { display: inline-flex; gap: 0.25rem; align-items: center; }

.mini-tag {
  color: var(--matery-primary);
  text-decoration: none;
}

.mini-tag:hover { text-decoration: underline; }

.card-summary {
  color: #666;
  font-size: 0.88rem;
  line-height: 1.6;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0 0 0.75rem;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.78rem;
  border-top: 1px dashed #eee;
  padding-top: 0.6rem;
}

.read-more {
  color: var(--matery-primary);
  text-decoration: none;
  font-weight: 500;
}

.read-more:hover { text-decoration: underline; }

.read-time {
  color: #999;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}
</style>


