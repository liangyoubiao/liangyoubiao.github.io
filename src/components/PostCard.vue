<script setup lang="ts">
import type { Post } from '@/utils/posts'

defineProps<{ post: Post }>()

function formatDate(date: string) {
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
</script>

<template>
  <article class="post-card">
    <h2 class="post-title">
      <RouterLink :to="post.url">{{ post.title }}</RouterLink>
    </h2>
    <div class="post-meta">
      <time>{{ formatDate(post.date) }}</time>
      <span v-if="post.tags?.length" class="post-tags">
        <RouterLink
          v-for="tag in post.tags"
          :key="tag"
          :to="`/tags/${encodeURIComponent(tag)}/`"
          class="tag"
        >#{{ tag }}</RouterLink>
      </span>
    </div>
    <p v-if="post.description" class="post-desc">{{ post.description }}</p>
  </article>
</template>

<style scoped>
.post-card {
  padding: 1.25rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.post-card:last-child {
  border-bottom: none;
}

.post-title {
  font-size: 1.35rem;
  margin: 0 0 0.4rem;
}

.post-title a {
  color: #2c3e50;
  text-decoration: none;
}

.post-title a:hover {
  color: #409eff;
}

.post-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  font-size: 0.85rem;
  color: #999;
  margin-bottom: 0.5rem;
}

.tag {
  color: #409eff;
  text-decoration: none;
  margin-right: 0.4rem;
}

.tag:hover {
  text-decoration: underline;
}

.post-desc {
  margin: 0.25rem 0 0;
  color: #666;
  font-size: 0.95rem;
}
</style>
