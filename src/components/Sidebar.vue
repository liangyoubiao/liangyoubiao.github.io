<script setup lang="ts">
import { getAllPosts } from '@/utils/posts'
import PostCalendar from './PostCalendar.vue'
import TagCloud from './TagCloud.vue'

const posts = getAllPosts()
</script>

<template>
  <aside class="sidebar">
    <TagCloud />
    <PostCalendar :posts="posts" />
  </aside>
</template>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  position: sticky;
  top: 80px;
  align-self: start;
}

@media (max-width: 992px) {
  .sidebar {
    position: static;
    margin-top: 2rem;
  }
}
</style>

