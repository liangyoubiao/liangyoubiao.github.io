<script setup lang="ts">
import { site } from '@/utils/site'
</script>

<template>
  <nav class="nav">
    <RouterLink
      v-for="item in site.nav"
      :key="item.path"
      :to="item.path"
      class="nav-link"
      active-class="is-active"
      :exact-active-class="item.path === '/' ? 'is-active' : ''"
    >
      {{ item.name }}
    </RouterLink>
  </nav>
</template>

<style scoped>
.nav {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
}

.nav-link {
  color: #555;
  text-decoration: none;
  font-size: 0.95rem;
  transition: color 0.2s;
}

.nav-link:hover {
  color: #2c3e50;
}

.nav-link.is-active {
  color: #409eff;
  font-weight: 600;
}
</style>
