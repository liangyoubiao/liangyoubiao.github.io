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
  <section>
    <h1>归档</h1>
    <p v-if="!years.length" class="empty">暂无文章。</p>
    <div v-for="year in years" :key="year" class="year-block">
      <h2>{{ year }}</h2>
      <ul>
        <li v-for="post in grouped[year]" :key="post.url">
          <time>{{ formatDate(post.date) }}</time>
          <RouterLink :to="post.url">{{ post.title }}</RouterLink>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
h1 {
  font-size: 1.5rem;
  margin: 0 0 1rem;
}

.year-block {
  margin-bottom: 1.5rem;
}

.year-block h2 {
  font-size: 1.2rem;
  margin: 0 0 0.5rem;
  color: #409eff;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  display: flex;
  gap: 0.75rem;
  padding: 0.3rem 0;
  border-bottom: 1px dashed #eee;
  align-items: baseline;
}

time {
  color: #999;
  font-size: 0.85rem;
  flex-shrink: 0;
}

a {
  color: #2c3e50;
  text-decoration: none;
}

a:hover {
  color: #409eff;
}

.empty {
  color: #999;
}
</style>
