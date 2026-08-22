<script setup lang="ts">
import { getPostsByYearMonth } from '@/utils/posts'

const grouped = getPostsByYearMonth()
const years = Object.keys(grouped).sort((a, b) => +b - +a)

function formatDate(date: string) {
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
</script>

<template>
  <div>
    <header class="page-banner">
      <div class="matery-container">
        <h1>📚 文章归档</h1>
        <p>共 {{ years.reduce((s, y) => s + Object.values(grouped[y]).flat().length, 0) }} 篇文章</p>
      </div>
    </header>

    <article class="matery-container">
      <p v-if="!years.length" class="empty">暂无文章。</p>
      <div v-for="year in years" :key="year" class="year-block">
        <h2 class="archive-year">{{ year }} 年</h2>
        <div v-for="month in Object.keys(grouped[year])" :key="month" class="month-block">
          <h3 class="archive-month">{{ Number(month) }} 月</h3>
          <RouterLink
            v-for="post in grouped[year][month]"
            :key="post.url"
            :to="post.url"
            class="archive-item"
          >
            <time>{{ formatDate(post.date) }}</time>
            <span class="archive-title">{{ post.title }}</span>
            <span v-if="post.tags?.length" class="archive-tags">
              <span v-for="t in post.tags.slice(0, 2)" :key="t" class="mini-tag">#{{ t }}</span>
            </span>
          </RouterLink>
        </div>
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

.archive-month {
  font-size: 1.1rem;
  color: #888;
  margin: 1rem 0 0.5rem;
  font-weight: 500;
}

.archive-title {
  flex: 1;
  color: var(--matery-text);
}

.archive-tags {
  display: inline-flex;
  gap: 0.4rem;
}

.mini-tag {
  color: var(--matery-primary);
  font-size: 0.8rem;
}
</style>

