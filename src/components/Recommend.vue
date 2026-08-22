<script setup lang="ts">
import { computed } from 'vue'
import type { Post } from '@/utils/posts'

const props = defineProps<{ posts: Post[] }>()

// 7 套推荐文章渐变(从老 matery 主题移植)
const GRADIENTS = [
  'linear-gradient(135deg, #FF5E3A 0%, #FF2A68 100%)',
  'linear-gradient(135deg, #EF4DB6 0%, #C643FC 100%)',
  'linear-gradient(135deg, #1AD6FD 0%, #1D62F0 100%)',
  'linear-gradient(135deg, #FFCC00 0%, #FF9500 100%)',
  'linear-gradient(135deg, #4cbf30 0%, #0f9d58 100%)',
  'linear-gradient(135deg, #C644FC 0%, #5856D6 100%)',
  'linear-gradient(135deg, #55EFCB 0%, #5BCAFF 100%)',
]

// 24 张 featureimage(从老 matery 主题迁移到 /medias/featureimages/)
const FEATURE_COUNT = 24

function hash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h) + s.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

const items = computed(() => props.posts.map((p, i) => {
  const cover = p.cover || `/medias/featureimages/${hash(p.slug) % FEATURE_COUNT}.webp`
  return {
    ...p,
    cover,
    gradient: GRADIENTS[i % GRADIENTS.length],
    excerpt: (p.description || extractExcerpt(p.content)).substring(0, 100),
  }
}))

function getCoverStyle(cover) { return { background: 'url(' + cover + ') center/cover, var(--matery-gradient)' } }

function extractExcerpt(md) {
  return md
    .replace(/```[\s\S]*?```/g, '')
    .replace(/!?\[.*?\]\(.*?\)/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/[#>*_`~\-]+/g, '')
    .replace(/\n+/g, ' ')
    .trim()
}

const dateText = (date: string) => {
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
</script>

<template>
  <section v-if="items.length" class="recommend-section">
    <div class="recommend-inner">
      <h2 class="section-title">
        <span class="title-icon">👍</span>
        <span>推荐文章</span>
      </h2>
      <p class="section-sub">精选置顶博文 · 值得一读</p>

      <div class="recommend-grid">
        <article
          v-for="p in items"
          :key="p.slug"
          class="rec-card"
        >
          <div class="rec-cover" :style="getCoverStyle(p.cover)">
            <span v-if="p.tags?.length" class="rec-category">
              {{ Array.isArray(p.categories) ? p.categories[0] : (p.categories || p.tags[0]) }}
            </span>
            <RouterLink :to="p.url" class="rec-cover-link" aria-label="阅读全文" />
          </div>
          <div class="rec-body">
            <RouterLink :to="p.url" class="rec-title-link">
              <h3 class="rec-title">{{ p.title }}</h3>
            </RouterLink>
            <p class="rec-excerpt">{{ p.excerpt }}…</p>
            <div class="rec-meta">
              <time>{{ dateText(p.date) }}</time>
              <RouterLink :to="p.url" class="rec-more">阅读全文 →</RouterLink>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.recommend-section {
  background: #fafafa;
  padding: 4rem 1.5rem;
  text-align: center;
  border-bottom: 1px solid #f0f0f0;
}

.recommend-inner {
  max-width: 1080px;
  margin: 0 auto;
}

.section-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 1.6rem;
  color: var(--matery-text);
  margin: 0 0 0.4rem;
  font-weight: 600;
}

.title-icon {
  font-size: 1.4rem;
}

.section-sub {
  color: #888;
  font-size: 0.95rem;
  margin: 0 0 2.5rem;
}

.recommend-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  text-align: left;
}

.rec-card {
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 10px 30px rgba(0, 0, 0, .12);
  display: flex;
  flex-direction: column;
  transition: transform 0.3s, box-shadow 0.3s;
  position: relative;
}

.rec-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, .18);
}

.rec-cover {
  height: 180px;
  position: relative;
  background: var(--matery-gradient);
  background-size: cover;
  background-position: center;
}

.rec-cover::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.25) 100%);
}

.rec-cover-link {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.rec-category {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  font-size: 0.75rem;
  padding: 4px 10px;
  border-radius: 999px;
  z-index: 2;
  font-weight: 500;
}

.rec-body {
  padding: 1.5rem;
  background: #fff;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.rec-title-link { text-decoration: none; color: inherit; }

.rec-title {
  font-size: 1.2rem;
  margin: 0 0 0.6rem;
  color: var(--matery-text);
  line-height: 1.4;
  font-weight: 600;
}

.rec-title-link:hover .rec-title { color: var(--matery-primary); }

.rec-excerpt {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.6;
  margin: 0 0 1rem;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.rec-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: #999;
  border-top: 1px dashed #eee;
  padding-top: 0.75rem;
}

.rec-more {
  color: var(--matery-primary);
  text-decoration: none;
  font-weight: 500;
}

.rec-more:hover { text-decoration: underline; }

@media (max-width: 640px) {
  .recommend-grid { grid-template-columns: 1fr; }
}
</style>





