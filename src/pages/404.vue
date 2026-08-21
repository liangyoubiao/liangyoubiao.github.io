<template>
  <section class="not-found">
    <h1>404</h1>
    <p>你访问的页面不存在。</p>
    <RouterLink to="/" class="back">返回首页</RouterLink>
  </section>
</template>

<style scoped>
.not-found {
  text-align: center;
  padding: 4rem 0;
}

.not-found h1 {
  font-size: 5rem;
  margin: 0;
  color: #ddd;
}

.not-found p {
  color: #888;
  margin: 0.5rem 0 1.5rem;
}

.back {
  color: #409eff;
  text-decoration: none;
}

.back:hover {
  text-decoration: underline;
}
</style>
