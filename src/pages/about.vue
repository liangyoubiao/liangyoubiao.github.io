<script setup lang="ts">
</script>

<template>
  <article class="markdown">
    <h1>👋 关于我</h1>
    <p>这里是 LiangYouBiao 的个人小天地,用来记录一些想法、笔记和作品。</p>

    <h2>📝 这里有什么</h2>
    <ul>
      <li>学习笔记:踩过的坑、读过的书、有用的小技巧</li>
      <li>生活随笔:日常、骑行、滑雪、读书、电影</li>
      <li>作品展示:偶尔写点代码、做点小东西</li>
    </ul>

    <h2>🌱 近期目标</h2>
    <ul>
      <li>坚持每周至少写一篇</li>
      <li>把以前的笔记整理出来</li>
      <li>多读几本一直想看的书</li>
    </ul>

    <h2>☕ 联系我</h2>
    <p>欢迎通过 <RouterLink to="/contact/">留言板</RouterLink> 或 <a href="https://github.com/liangyoubiao" target="_blank" rel="noopener">GitHub</a> 找到我,看到都会回。</p>
  </article>
</template>

<style scoped>
.markdown {
  line-height: 1.85;
  max-width: 760px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem;
}

.markdown h1 {
  font-size: 1.8rem;
  margin: 0 0 1.25rem;
  color: var(--matery-text);
}

.markdown h2 {
  font-size: 1.25rem;
  margin: 2rem 0 0.75rem;
  padding-bottom: 0.4rem;
  border-bottom: 1px solid #f0f0f0;
  color: var(--matery-text);
}

.markdown p {
  margin: 0.75rem 0;
  color: #444;
}

.markdown ul {
  padding-left: 1.5rem;
  margin: 0.5rem 0 1rem;
}

.markdown li {
  margin: 0.4rem 0;
  color: #555;
}

.markdown a {
  color: var(--matery-primary);
  text-decoration: none;
  border-bottom: 1px dashed transparent;
}

.markdown a:hover {
  border-bottom-color: var(--matery-primary);
}
</style>

