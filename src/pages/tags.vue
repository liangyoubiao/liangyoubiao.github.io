<script setup lang="ts">
import { getAllPosts, getAllTags } from '@/utils/posts'

const posts = getAllPosts()
const tags = getAllTags(posts)
const counts: Record<string, number> = {}
for (const t of tags) counts[t] = posts.filter((p) => p.tags?.includes(t)).length
</script>

<template>
  <div>
    <header class="page-banner">
      <div class="matery-container">
        <h1>🏷️ 标签</h1>
        <p>共 {{ tags.length }} 个标签 · {{ posts.length }} 篇文章</p>
      </div>
    </header>

    <article class="matery-container">
      <p v-if="!tags.length" class="empty">暂无标签。</p>
      <ul v-else class="tag-cloud">
        <li v-for="tag in tags" :key="tag">
          <RouterLink :to="`/tags/${encodeURIComponent(tag)}/`" class="chip">
            #{{ tag }} <span style="opacity: 0.8; margin-left: 0.25rem">{{ counts[tag] }}</span>
          </RouterLink>
        </li>
      </ul>
    </article>
  </div>
</template>

<style scoped>
.empty {
  text-align: center;
  padding: 4rem 1rem;
  color: #999;
}
</style>

