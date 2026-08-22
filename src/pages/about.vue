<template>
  <div>
    <header class="page-banner">
      <div class="matery-container">
        <h1>👋 关于我</h1>
        <p>一些关于本站和我自己的介绍</p>
      </div>
    </header>

    <article class="page-body markdown">
      <h2>关于本站</h2>
      <p>本站从 Hexo (matery 主题) 静态博客迁移至 <strong>Vue 3 + Vite + vite-ssg</strong>,目前为视觉复刻阶段,后续将逐步完善功能。</p>

      <h2>关于我</h2>
      <p>一个喜欢写代码、骑行、滑雪的普通人。</p>
      <ul>
        <li>📍 现居北京</li>
        <li>💻 工作中</li>
        <li>🚴 累计骑行 4000+ 公里</li>
        <li>⛷️ 双板入门,单板进阶中</li>
        <li>📷 拍视频和照片爱好者</li>
      </ul>

      <h2>技术栈</h2>
      <p>本站使用:</p>
      <ul>
        <li>Vue 3.5 + TypeScript</li>
        <li>Vite 8 + vite-ssg 静态生成</li>
        <li>markdown-it 渲染</li>
        <li>GitHub Actions 部署到 GitHub Pages</li>
      </ul>
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

.markdown h2 {
  margin-top: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #f0f0f0;
}
</style>

