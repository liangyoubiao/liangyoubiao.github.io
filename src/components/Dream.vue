<script setup lang="ts">
import { site } from '@/utils/site'
</script>

<template>
  <section class="dream-section">
    <div class="dream-inner">
      <h2 class="dream-title">
        <span class="dream-icon">💡</span>
        <span>{{ site.dream.title }}</span>
      </h2>
      <p class="dream-text">{{ site.dream.text }}</p>
    </div>
  </section>
</template>

<style scoped>
.dream-section {
  background: linear-gradient(135deg, #fff 0%, #f8fafc 100%);
  padding: 4rem 1.5rem;
  text-align: center;
  border-bottom: 1px solid #f0f0f0;
}

.dream-inner {
  max-width: 720px;
  margin: 0 auto;
}

.dream-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 1.6rem;
  color: var(--matery-text);
  margin: 0 0 1rem;
  font-weight: 600;
}

.dream-icon {
  font-size: 1.4rem;
  filter: drop-shadow(0 0 8px rgba(255, 193, 7, 0.4));
}

.dream-text {
  font-size: 1.05rem;
  line-height: 1.85;
  color: #555;
  margin: 0;
  letter-spacing: 0.02em;
  text-align: center;
}
</style>

