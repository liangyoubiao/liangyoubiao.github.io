<script setup lang="ts">
import PostCard from '@/components/PostCard.vue'
import { getAllPosts } from '@/utils/posts'

const posts = getAllPosts()
</script>

<template>
  <section class="home">
    <h1 class="page-title">最新文章</h1>
    <p v-if="!posts.length" class="empty">还没有文章,先去 <code>src/content/posts/</code> 添加一篇吧。</p>
    <div v-else class="post-list">
      <PostCard v-for="post in posts" :key="post.slug" :post="post" />
    </div>
  </section>
</template>

<style scoped>
.page-title {
  font-size: 1.5rem;
  margin: 0 0 1rem;
}

.empty {
  color: #999;
  font-size: 0.95rem;
}

.empty code {
  background: #f5f5f5;
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  font-size: 0.9em;
}

.post-list {
  margin-top: 1rem;
}
</style>
