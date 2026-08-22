<script setup lang="ts">
import DefaultLayout from './layouts/Default.vue'
</script>

<template>
  <DefaultLayout>
    <RouterView />
  </DefaultLayout>
</template>

<style>
/* 页面切换动画(暂时禁用以便排查 hydration 问题) */
/*
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@media (prefers-reduced-motion: reduce) {
  .page-enter-active,
  .page-leave-active {
    transition: none;
  }
  .page-enter-from,
  .page-leave-to {
    transform: none;
  }
}
*/
</style>

