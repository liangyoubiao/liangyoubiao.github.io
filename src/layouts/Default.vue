<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'
import { site } from '@/utils/site'

const year = new Date().getFullYear()
</script>

<template>
  <div class="app">
    <header class="site-header">
      <div class="site-brand">
        <RouterLink to="/" class="brand-link">{{ site.title }}</RouterLink>
        <p class="brand-desc">{{ site.description }}</p>
      </div>
      <NavBar />
    </header>

    <main class="site-main">
      <slot />
    </main>

    <footer class="site-footer">
      <p>© {{ year }} {{ site.author }} · Powered by Vue 3 + Vite + vite-ssg</p>
      <p class="footer-meta">从 Hexo 静态博客迁移而来 · 当前为最基础版本</p>
    </footer>
  </div>
</template>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  max-width: 960px;
  margin: 0 auto;
  padding: 0 1.25rem;
}

.site-header {
  padding: 2.5rem 0 1.5rem;
  border-bottom: 1px solid #eaeaea;
  margin-bottom: 2rem;
}

.site-brand {
  margin-bottom: 1rem;
}

.brand-link {
  font-size: 1.75rem;
  font-weight: 700;
  color: #2c3e50;
  text-decoration: none;
}

.brand-desc {
  color: #888;
  font-size: 0.9rem;
  margin: 0.25rem 0 0;
}

.site-main {
  flex: 1;
}

.site-footer {
  border-top: 1px solid #eaeaea;
  padding: 1.5rem 0;
  margin-top: 3rem;
  text-align: center;
  color: #888;
  font-size: 0.85rem;
}

.footer-meta {
  margin: 0.25rem 0 0;
  font-size: 0.8rem;
  opacity: 0.7;
}

@media (max-width: 640px) {
  .app {
    padding: 0 1rem;
  }
  .site-header {
    padding: 1.5rem 0 1rem;
  }
}
</style>
