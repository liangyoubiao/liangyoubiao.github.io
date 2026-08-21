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
  <section>
    <h1>友情链接</h1>
    <p class="hint">欢迎互换友链,可在 <code>src/data/friends.json</code> 中添加。</p>
    <ul class="friend-grid">
      <li v-for="f in friends" :key="f.url" class="friend-card">
        <a :href="f.url" target="_blank" rel="noopener">
          <img v-if="f.avatar" :src="f.avatar" :alt="f.name" class="avatar" />
          <div class="meta">
            <h3>{{ f.name }}</h3>
            <p v-if="f.introduction">{{ f.introduction }}</p>
          </div>
        </a>
      </li>
    </ul>
  </section>
</template>

<style scoped>
h1 {
  font-size: 1.5rem;
  margin: 0 0 0.5rem;
}

.hint {
  color: #888;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

.hint code {
  background: #f5f5f5;
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
}

.friend-grid {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
}

.friend-card {
  border: 1px solid #eee;
  border-radius: 8px;
  transition: box-shadow 0.2s, transform 0.2s;
}

.friend-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  transform: translateY(-2px);
}

.friend-card a {
  display: flex;
  gap: 0.75rem;
  padding: 0.9rem;
  text-decoration: none;
  color: inherit;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.meta h3 {
  margin: 0;
  font-size: 1rem;
  color: #2c3e50;
}

.meta p {
  margin: 0.25rem 0 0;
  font-size: 0.85rem;
  color: #888;
}
</style>
