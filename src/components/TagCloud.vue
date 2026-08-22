<script setup lang="ts">
import { computed } from 'vue'
import { getAllTags, getAllPosts } from '@/utils/posts'

const posts = getAllPosts()
const tags = getAllTags(posts)
const counts: Record<string, number> = {}
let maxCount = 0
for (const t of tags) {
  const c = posts.filter((p) => p.tags?.includes(t)).length
  counts[t] = c
  if (c > maxCount) maxCount = c
}

const minSize = 0.82
const maxSize = 1.4

function fontSizeFor(count: number) {
  if (maxCount <= 1) return maxSize
  return minSize + (count - 1) / (maxCount - 1) * (maxSize - minSize)
}

const items = computed(() =>
  tags
    .map((t) => ({ name: t, count: counts[t], size: fontSizeFor(counts[t]) }))
    .sort((a, b) => b.count - a.count),
)
</script>

<template>
  <section class="tag-widget">
    <h3 class="widget-title">
      <i class="fas fa-tags"></i>
      <span>标签云</span>
    </h3>
    <p v-if="!items.length" class="empty">暂无标签</p>
    <div v-else class="tag-cloud">
      <RouterLink
        v-for="t in items"
        :key="t.name"
        :to="`/tags/${encodeURIComponent(t.name)}/`"
        class="tag"
        :style="{ fontSize: t.size + 'rem' }"
      >
        {{ t.name }}
        <span class="tag-count">{{ t.count }}</span>
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
.tag-widget {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(50, 50, 93, .08), 0 4px 10px rgba(0, 0, 0, .05);
  padding: 1.25rem;
}

.widget-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.05rem;
  margin: 0 0 1rem;
  color: var(--matery-text);
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 0.6rem;
}

.widget-title i { color: var(--matery-primary); }

.empty {
  color: #888;
  font-size: 0.9rem;
  text-align: center;
  margin: 1rem 0;
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 0.6rem;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 0;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.3rem 0.7rem;
  background: #f5f5f5;
  color: #555;
  text-decoration: none;
  border-radius: 999px;
  line-height: 1.2;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.tag:hover {
  background: var(--matery-primary);
  color: #fff;
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(15, 157, 88, .3);
}

.tag-count {
  font-size: 0.7em;
  background: rgba(255, 255, 255, 0.5);
  color: inherit;
  padding: 0 0.35rem;
  border-radius: 999px;
  font-weight: 600;
}

.tag:hover .tag-count {
  background: rgba(255, 255, 255, 0.25);
  color: #fff;
}
</style>

