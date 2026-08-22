<script setup lang="ts">
import Banner from '@/components/Banner.vue'
import PostCard from '@/components/PostCard.vue'
import { getAllPosts } from '@/utils/posts'

const posts = getAllPosts()
</script>

<template>
  <Banner />

  <article id="articles" class="container articles">
    <div class="row article-row">
      <div v-for="post in posts" :key="post.slug" class="article-col">
        <PostCard :post="post" />
      </div>
      <div v-if="!posts.length" class="empty">
        <p>还没有文章,先去 <code>src/content/posts/</code> 添加一篇吧。</p>
      </div>
    </div>
  </article>
</template>

<style scoped>
.empty {
  text-align: center;
  padding: 4rem 1rem;
  color: #999;
  width: 100%;
}

.empty code {
  background: #f5f5f5;
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  font-size: 0.9em;
}
</style>

