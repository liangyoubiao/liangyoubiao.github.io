<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { getAllPosts } from '@/utils/posts'
import { renderMarkdown } from '@/utils/markdown'

const route = useRoute()
const posts = getAllPosts()

const post = computed(() => {
  // Match by URL path (year/month/day/slug) to preserve old Hexo URL structure
  return posts.find((p) => p.url === route.path)
})

const html = computed(() => (post.value ? renderMarkdown(post.value.content) : ''))

function formatDate(date: string) {
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
</script>

<template>
  <article v-if="post" class="post-detail markdown">
    <h1>{{ post.title }}</h1>
    <div class="meta">
      <time>{{ formatDate(post.date) }}</time>
      <span v-if="post.tags?.length" class="tags">
        <RouterLink
          v-for="tag in post.tags"
          :key="tag"
          :to="`/tags/${encodeURIComponent(tag)}/`"
          class="tag"
        >#{{ tag }}</RouterLink>
      </span>
    </div>
    <div class="content" v-html="html"></div>
    <div class="back">
      <RouterLink to="/">← 返回首页</RouterLink>
    </div>
  </article>
  <section v-else class="not-found">
    <h1>文章未找到</h1>
    <RouterLink to="/">返回首页</RouterLink>
  </section>
</template>

<style scoped>
.post-detail {
  line-height: 1.75;
  color: #2c3e50;
}

.post-detail h1 {
  font-size: 1.85rem;
  margin: 0 0 0.5rem;
}

.meta {
  color: #999;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.tag {
  color: #409eff;
  text-decoration: none;
  margin-right: 0.4rem;
}

.tag:hover {
  text-decoration: underline;
}

.content :deep(h2) {
  margin-top: 2rem;
  font-size: 1.4rem;
}

.content :deep(h3) {
  margin-top: 1.5rem;
  font-size: 1.15rem;
}

.content :deep(p) {
  margin: 0.75rem 0;
}

.content :deep(code) {
  background: #f5f5f5;
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  font-size: 0.9em;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.content :deep(pre) {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 1rem;
  border-radius: 6px;
  overflow-x: auto;
  line-height: 1.5;
}

.content :deep(pre code) {
  background: none;
  color: inherit;
  padding: 0;
}

.content :deep(blockquote) {
  border-left: 4px solid #409eff;
  margin: 1rem 0;
  padding: 0.5rem 1rem;
  background: #f9f9f9;
  color: #666;
}

.content :deep(a) {
  color: #409eff;
  text-decoration: none;
}

.content :deep(a:hover) {
  text-decoration: underline;
}

.content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
}

.back {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
}

.back a {
  color: #409eff;
  text-decoration: none;
}

.not-found {
  text-align: center;
  padding: 3rem 0;
}

.not-found a {
  color: #409eff;
  text-decoration: none;
}
</style>
