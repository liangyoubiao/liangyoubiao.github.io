<script setup lang="ts">
import Banner from '@/components/Banner.vue'
import PostCard from '@/components/PostCard.vue'
import Dream from '@/components/Dream.vue'
import Recommend from '@/components/Recommend.vue'
import { getAllPosts, getRecommendedPosts } from '@/utils/posts'

const posts = getAllPosts()
const recommended = getRecommendedPosts()
const latestPosts = posts.filter((p) => !p.top)
</script>

<template>
  <Banner />

  <Dream />

  <Recommend v-if="recommended.length" :posts="recommended" />

  <article id="articles" class="container articles">
    <header class="latest-header">
      <h2 class="latest-title">
        <span class="title-icon">📚</span>
        <span>最新文章</span>
      </h2>
      <p class="latest-sub">共 {{ latestPosts.length }} 篇 · 按发布时间倒序</p>
    </header>

    <div class="row article-row">
      <div v-for="post in latestPosts" :key="post.slug" class="article-col">
        <PostCard :post="post" />
      </div>
      <div v-if="!latestPosts.length" class="empty">
        <p>还没有文章,先去 <code>src/content/posts/</code> 添加一篇吧。</p>
      </div>
    </div>
  </article>
</template>

<style scoped>
.latest-header {
  text-align: center;
  margin-bottom: 2rem;
  padding-top: 1rem;
}

.latest-title {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  color: var(--matery-text);
  margin: 0 0 0.4rem;
  font-weight: 600;
}

.title-icon { font-size: 1.4rem; }

.latest-sub {
  color: #888;
  font-size: 0.9rem;
  margin: 0;
}

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

