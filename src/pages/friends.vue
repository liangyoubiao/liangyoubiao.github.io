<script setup lang="ts">
import friendsData from '@/data/friends.json'

interface Friend {
  name: string
  url: string
  avatar?: string
  introduction?: string
}

const friends = friendsData as Friend[]
</script>

<template>
  <div>
    <header class="page-banner">
      <div class="matery-container">
        <h1>🤝 友情链接</h1>
        <p>共 {{ friends.length }} 位朋友</p>
      </div>
    </header>

    <article class="matery-container">
      <p class="hint">欢迎互换友链,可在 <code>src/data/friends.json</code> 中添加。</p>
      <div class="friend-grid">
        <a v-for="f in friends" :key="f.url" :href="f.url" target="_blank" rel="noopener" class="friend-card">
          <img v-if="f.avatar" :src="f.avatar" :alt="f.name" class="avatar" />
          <div class="meta">
            <h3>{{ f.name }}</h3>
            <p v-if="f.introduction">{{ f.introduction }}</p>
          </div>
        </a>
      </div>
    </article>
  </div>
</template>

<style scoped>
.hint {
  color: #888;
  font-size: 0.9rem;
  margin: 1.5rem 0;
}

.hint code {
  background: #f5f5f5;
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
}

.friend-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  padding-bottom: 2rem;
}

.friend-card .meta h3 {
  margin: 0;
  font-size: 1.05rem;
  color: var(--matery-text);
}

.friend-card .meta p {
  margin: 0.3rem 0 0;
  font-size: 0.85rem;
  color: #888;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

