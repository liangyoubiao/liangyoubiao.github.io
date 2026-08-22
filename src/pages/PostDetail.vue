<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Banner from '@/components/Banner.vue'
import { getAllPosts } from '@/utils/posts'
import { renderMarkdown } from '@/utils/markdown'

const route = useRoute()
const posts = getAllPosts()

const post = computed(() => {
  return posts.find((p) => p.url === route.path)
})

const html = computed(() => (post.value ? renderMarkdown(post.value.content) : ''))

const dateText = computed(() => {
  if (!post.value) return ''
  const d = new Date(post.value.date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
})

const wordCount = computed(() => {
  if (!post.value) return 0
  return post.value.content.length
})
</script>

<template>
  <article v-if="post">
    <Banner :title="post.title" post-title height="post" />

    <div id="artDetail" class="post-container">
      <div class="card">
        <div class="card-content article-info">
          <div class="row tag-cate">
            <div class="col s7 article-tag">
              <RouterLink
                v-for="tag in post.tags || []"
                :key="tag"
                :to="`/tags/${encodeURIComponent(tag)}/`"
                class="chip"
              >#{{ tag }}</RouterLink>
              <span v-if="!post.tags?.length" class="chip">未分类</span>
            </div>
            <div v-if="post.categories" class="col s5 right-align post-cate">
              <i>📑</i>
              <a href="#">{{ Array.isArray(post.categories) ? post.categories.join(', ') : post.categories }}</a>
            </div>
          </div>

          <div class="post-info">
            <span class="info-item">
              <i>📅</i>
              <span>发布于 {{ dateText }}</span>
            </span>
            <span class="info-item">
              <i>📝</i>
              <span>{{ wordCount }} 字</span>
            </span>
            <span class="info-item">
              <i>⏱️</i>
              <span>约 {{ Math.max(1, Math.ceil(wordCount / 400)) }} 分钟</span>
            </span>
          </div>
        </div>

        <div class="card-content article-content" v-html="html"></div>

        <div class="card-content article-footer">
          <RouterLink to="/" class="back-home">← 返回首页</RouterLink>
        </div>
      </div>
    </div>
  </article>

  <section v-else class="not-found">
    <h1>文章未找到</h1>
    <RouterLink to="/">返回首页</RouterLink>
  </section>
</template>

<style scoped>
.article-footer {
  padding: 1.5rem 2.5rem 2rem;
  border-top: 1px solid #f0f0f0;
}

.back-home {
  color: var(--matery-primary);
  text-decoration: none;
}

.back-home:hover { text-decoration: underline; }

.not-found {
  text-align: center;
  padding: 5rem 1rem;
}

.not-found a {
  color: var(--matery-primary);
  text-decoration: none;
}
</style>

