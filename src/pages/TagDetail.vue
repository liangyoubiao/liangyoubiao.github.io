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
  <section>
    <h1>标签:#{{ tag }}</h1>
    <p class="count">共 {{ posts.length }} 篇文章</p>
    <div v-if="posts.length" class="post-list">
      <PostCard v-for="post in posts" :key="post.slug" :post="post" />
    </div>
    <p v-else class="empty">该标签下暂无文章。</p>
  </section>
</template>

<style scoped>
h1 {
  font-size: 1.5rem;
  margin: 0 0 0.25rem;
}

.count {
  color: #888;
  font-size: 0.9rem;
  margin: 0 0 1rem;
}

.post-list {
  margin-top: 1rem;
}

.empty {
  color: #999;
}
</style>
