<script setup lang="ts">
import { getAllPosts } from '@/utils/posts'

const posts = getAllPosts()
const grouped: Record<string, typeof posts> = {}
for (const p of posts) {
  const cat = (Array.isArray(p.categories) ? p.categories[0] : p.categories) ?? '未分类'
  ;(grouped[cat] ??= []).push(p)
}
const categories = Object.keys(grouped).sort()
</script>

<template>
  <div>
    <header class="page-banner">
      <div class="matery-container">
        <h1>📂 文章分类</h1>
        <p>共 {{ categories.length }} 个分类</p>
      </div>
    </header>

    <article class="matery-container">
      <p v-if="!categories.length" class="empty">暂无分类。</p>
      <div v-for="cat in categories" :key="cat" class="cat-block">
        <h2 class="archive-year">{{ cat }} <span class="count">({{ grouped[cat].length }})</span></h2>
        <RouterLink
          v-for="p in grouped[cat]"
          :key="p.slug"
          :to="p.url"
          class="archive-item"
        >
          <time>{{ new Date(p.date).toISOString().slice(0, 10) }}</time>
          <span class="archive-title">{{ p.title }}</span>
        </RouterLink>
      </div>
    </article>
  </div>
</template>

<style scoped>
.empty {
  text-align: center;
  padding: 4rem 1rem;
  color: #999;
}

.cat-block {
  margin-bottom: 1rem;
}

.count {
  font-size: 0.9rem;
  font-weight: normal;
  opacity: 0.85;
}

.archive-title {
  flex: 1;
  color: var(--matery-text);
}
</style>

