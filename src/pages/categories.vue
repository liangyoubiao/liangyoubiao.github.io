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
  <section>
    <h1>分类</h1>
    <p v-if="!categories.length" class="empty">暂无分类。</p>
    <div v-for="cat in categories" :key="cat" class="cat-block">
      <h2>{{ cat }} <span class="count">({{ grouped[cat].length }})</span></h2>
      <ul>
        <li v-for="p in grouped[cat]" :key="p.slug">
          <RouterLink :to="p.url">{{ p.title }}</RouterLink>
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

.cat-block {
  margin-bottom: 1.5rem;
}

.cat-block h2 {
  font-size: 1.15rem;
  margin: 0 0 0.5rem;
}

.count {
  color: #999;
  font-size: 0.85rem;
  font-weight: normal;
}

ul {
  margin: 0;
  padding-left: 1.25rem;
}

li {
  margin: 0.25rem 0;
}

a {
  color: #409eff;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.empty {
  color: #999;
}
</style>
