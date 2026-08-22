<script setup lang="ts">
// 静态 HTML demo 列表(从 E:\my-blog\source\demos\ 复制到 public/demos/)
const demos = [
  {
    name: 'test',
    title: '478 呼吸进度条',
    desc: '478 呼吸法(吸 4 屏 7 呼 8)的可视化进度动画,深色背景适合冥想场景。',
    icon: '🫁',
    category: '训练',
  },
  {
    name: '倒计时_简约_自定义_放大',
    title: '倒计时 · 简约自定义',
    desc: '可自定义时长的倒计时器,数字放大显示,简约风格。',
    icon: '⏱️',
    category: '工具',
  },
  {
    name: '警醒语句01',
    title: '警醒语句',
    desc: '随机显示励志/警醒语句,适合作为桌面激励背景。',
    icon: '💡',
    category: '工具',
  },
  {
    name: '球_三角形_双峰_3s_嘴鼻',
    title: '呼吸训练 · 双峰球',
    desc: '三段式(吸-屏-呼)呼吸可视化,带嘴鼻三角形动效。',
    icon: '🎈',
    category: '训练',
  },
  {
    name: '进度条_垂直33',
    title: '呼吸训练 · 垂直进度',
    desc: '垂直方向的三段呼吸进度条,适合窄屏展示。',
    icon: '📊',
    category: '训练',
  },
  {
    name: '修仙等级与财富',
    title: '修仙等级与财富',
    desc: '修仙主题的等级与财富对照表(纯静态文字/表格)。',
    icon: '⚔️',
    category: '娱乐',
  },
  {
    name: '网易有道词典_发音',
    title: '网易有道词典 · 发音',
    desc: '有道词典发音按钮的样式复刻,带交互效果。',
    icon: '🔊',
    category: '学习',
  },
]

// /page/ 和 /test/ 是独立路径,放在底部「其他」区
const otherPages = [
  { name: 'page', title: '随机抽取数字', desc: '随机名字/数字抽取器,带名单管理与已抽记录。', icon: '🎲', path: '/page/' },
  { name: 'test', title: '478 呼吸(独立页)', desc: 'test/index.html 中的呼吸训练独立页。', icon: '🧪', path: '/test/' },
]

const categories = [...new Set(demos.map((d) => d.category))]
</script>

<template>
  <div>
    <header class="page-banner">
      <div class="matery-container">
        <h1>🛠️ 小工具</h1>
        <p>共 {{ demos.length + otherPages.length }} 个小工具 · 复用自 Hexo 老站</p>
      </div>
    </header>

    <article class="matery-container demos-page">
      <p class="hint">
        点击卡片在新标签页打开对应 HTML 演示。原始代码见
        <code>public/demos/</code>、<code>public/page/</code>、<code>public/test/</code>。
      </p>

      <div v-for="cat in categories" :key="cat" class="cat-section">
        <h2 class="archive-year">{{ cat }}</h2>
        <div class="demo-grid">
          <a
            v-for="d in demos.filter((x) => x.category === cat)"
            :key="d.name"
            :href="`/demos/${d.name}.html`"
            target="_blank"
            rel="noopener"
            class="demo-card"
          >
            <div class="demo-icon">{{ d.icon }}</div>
            <div class="demo-meta">
              <h3>{{ d.title }}</h3>
              <p>{{ d.desc }}</p>
              <span class="demo-link">打开 →</span>
            </div>
          </a>
        </div>
      </div>

      <h2 class="archive-year" style="margin-top: 2rem">独立页面</h2>
      <div class="demo-grid">
        <a
          v-for="p in otherPages"
          :key="p.name"
          :href="p.path"
          target="_blank"
          rel="noopener"
          class="demo-card"
        >
          <div class="demo-icon">{{ p.icon }}</div>
          <div class="demo-meta">
            <h3>{{ p.title }}</h3>
            <p>{{ p.desc }}</p>
            <span class="demo-link">打开 →</span>
          </div>
        </a>
      </div>
    </article>
  </div>
</template>

<style scoped>
.demos-page {
  padding-bottom: 2rem;
}

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

.cat-section {
  margin-bottom: 1.5rem;
}

.demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.demo-card {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 15px 35px rgba(50, 50, 93, .1), 0 5px 15px rgba(0, 0, 0, .07);
  padding: 1.25rem;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s, box-shadow 0.2s;
}

.demo-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 20px 40px rgba(50, 50, 93, .15), 0 8px 20px rgba(0, 0, 0, .1);
}

.demo-icon {
  font-size: 2rem;
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: var(--matery-gradient);
  color: #fff;
}

.demo-meta h3 {
  margin: 0 0 0.3rem;
  font-size: 1.05rem;
  color: var(--matery-text);
}

.demo-meta p {
  margin: 0 0 0.5rem;
  font-size: 0.85rem;
  color: #888;
  line-height: 1.5;
}

.demo-meta code {
  background: #f5f5f5;
  padding: 0.05rem 0.3rem;
  border-radius: 3px;
  font-size: 0.8em;
  color: var(--matery-primary);
}

.demo-link {
  font-size: 0.85rem;
  color: var(--matery-primary);
  font-weight: 500;
}
</style>

