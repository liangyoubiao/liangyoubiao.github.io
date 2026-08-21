<script setup lang="ts">
import { getAllPosts, getAllTags } from '@/utils/posts'

const posts = getAllPosts()
const tags = getAllTags(posts)
const counts: Record<string, number> = {}
for (const t of tags) counts[t] = posts.filter((p) => p.tags?.includes(t)).length
</script>

<template>
  <section>
    <h1>标签</h1>
    <p v-if="!tags.length" class="empty">暂无标签。</p>
    <ul class="tag-cloud">
      <li v-for="tag in tags" :key="tag">
        <RouterLink :to="`/tags/${encodeURIComponent(tag)}/`" class="tag">
          #{{ tag }} <span class="count">{{ counts[tag] }}</span>
        </RouterLink>
      </li>
    </ul>
  </section>
</template>

<style scoped>
h1 {
  font-size: 1.5rem;
  margin: 0 0 1rem;
}

.tag-cloud {
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.tag {
  display: inline-block;
  padding: 0.3rem 0.75rem;
  background: #f0f7ff;
  border: 1px solid #d6e8ff;
  border-radius: 999px;
  color: #409eff;
  text-decoration: none;
  font-size: 0.9rem;
}

.tag:hover {
  background: #409eff;
  color: #fff;
}

.count {
  margin-left: 0.25rem;
  font-size: 0.75rem;
  opacity: 0.7;
}

.empty {
  color: #999;
}
</style>
