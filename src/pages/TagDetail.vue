<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import PostCard from '@/components/PostCard.vue'
import { getPostsByTag } from '@/utils/posts'

const route = useRoute()
const tag = computed(() => decodeURIComponent(route.params.tag as string))
const posts = computed(() => getPostsByTag(tag.value))
</script>

<template>
  <div>
    <header class="page-banner">
      <div class="matery-container">
        <h1>#{{ tag }}</h1>
        <p>共 {{ posts.length }} 篇文章</p>
      </div>
    </header>

    <article id="articles" class="container articles">
      <div class="row article-row">
        <div v-for="post in posts" :key="post.slug" class="article-col">
          <PostCard :post="post" />
        </div>
        <p v-if="!posts.length" class="empty">该标签下暂无文章。</p>
      </div>
    </article>
  </div>
</template>

<style scoped>
.empty {
  text-align: center;
  padding: 4rem 1rem;
  color: #999;
  width: 100%;
}
</style>

