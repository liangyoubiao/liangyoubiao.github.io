<template>
  <div>
    <header class="page-banner">
      <div class="matery-container">
        <h1>💌 留言板</h1>
        <p>欢迎留言</p>
      </div>
    </header>

    <article class="page-body markdown">
      <p>欢迎留言!当前为基础版本,评论系统接入待后续实现(计划:<strong>Twikoo / Waline</strong>)。</p>
      <p>可临时通过 <a href="https://github.com/liangyoubiao" target="_blank" rel="noopener">GitHub</a> 或邮箱联系我。</p>

      <h2>关于评论系统的计划</h2>
      <ul>
        <li><strong>Twikoo</strong> — 简洁、自部署、Vercel 一键</li>
        <li><strong>Waline</strong> — 来自 Valine 继承,服务端可选</li>
        <li><strong>Giscus</strong> — 基于 GitHub Discussions</li>
      </ul>
      <p>当前阶段优先保证视觉风格与基础功能,评论系统会在站点内容稳定后接入。</p>
    </article>
  </div>
</template>

<style scoped>
.markdown {
  line-height: 1.85;
}

.markdown ul {
  padding-left: 1.5rem;
}

.markdown li {
  margin: 0.4rem 0;
}

.markdown a {
  color: var(--matery-primary);
  text-decoration: none;
}

.markdown a:hover { text-decoration: underline; }
</style>

