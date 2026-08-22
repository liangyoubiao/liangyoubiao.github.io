<script setup lang="ts">
import { computed, ref } from 'vue'
import { getAllPosts } from '@/utils/posts'

const posts = getAllPosts()
const selectedYear = ref<number | null>(null)

// 所有有文章的年份
const years = computed(() => {
  const ys = new Set<number>()
  posts.forEach((p) => ys.add(Number(p.year)))
  return [...ys].sort((a, b) => b - a)
})

if (!selectedYear.value && years.value.length) selectedYear.value = years.value[0]

interface MonthBucket {
  year: number
  month: number
  posts: typeof posts
}
const MONTHS_CN = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']

const monthsOfYear = computed<MonthBucket[]>(() => {
  if (!selectedYear.value) return []
  const arr: MonthBucket[] = []
  for (let m = 1; m <= 12; m++) {
    arr.push({ year: selectedYear.value, month: m, posts: [] })
  }
  posts.forEach((p) => {
    if (Number(p.year) === selectedYear.value) {
      const bucket = arr.find((b) => b.month === Number(p.month))
      if (bucket) bucket.posts.push(p)
    }
  })
  return arr
})

const totalThisYear = computed(() => monthsOfYear.value.reduce((s, m) => s + m.posts.length, 0))

function dayLabel(d: string) {
  const date = new Date(d)
  return date.getDate()
}
</script>

<template>
  <div>
    <header class="page-banner">
      <div class="matery-container">
        <h1>📅 文章日历</h1>
        <p>按年份浏览所有文章</p>
      </div>
    </header>

    <article class="calendar-page">
      <div class="year-picker">
        <button
          v-for="y in years"
          :key="y"
          :class="['year-btn', y === selectedYear && 'is-active']"
          @click="selectedYear = y"
        >{{ y }} 年</button>
      </div>

      <div v-if="!years.length" class="empty">
        <p>还没有文章。</p>
      </div>

      <div v-else class="year-meta">
        共 <strong>{{ totalThisYear }}</strong> 篇文章,12 个月
      </div>

      <div class="months-grid">
        <div
          v-for="m in monthsOfYear"
          :key="`${m.year}-${m.month}`"
          :class="['month-card', m.posts.length === 0 && 'month-empty']"
        >
          <h3 class="month-title">
            <span class="month-num">{{ m.month }}</span>
            <span class="month-name">月</span>
            <span class="month-count">{{ m.posts.length }} 篇</span>
          </h3>
          <ul v-if="m.posts.length" class="month-posts">
            <li v-for="p in m.posts" :key="p.url">
              <span class="post-day">{{ dayLabel(p.date) }}</span>
              <RouterLink :to="p.url" class="post-link">{{ p.title }}</RouterLink>
            </li>
          </ul>
          <p v-else class="month-no-post">本月无文章</p>
        </div>
      </div>
    </article>
  </div>
</template>

<style scoped>
.calendar-page {
  max-width: var(--container-width, 1125px);
  margin: 0 auto;
  padding: 2.5rem 1.5rem;
}

.year-picker {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.year-btn {
  padding: 0.5rem 1.25rem;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 999px;
  color: #555;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.2s;
}

.year-btn:hover {
  border-color: var(--matery-primary);
  color: var(--matery-primary);
}

.year-btn.is-active {
  background-image: var(--matery-gradient);
  color: #fff;
  border-color: transparent;
  box-shadow: 0 4px 12px rgba(15, 157, 88, .3);
}

.year-meta {
  text-align: center;
  color: #888;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.year-meta strong {
  color: var(--matery-primary);
  font-size: 1.1em;
}

.months-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.25rem;
}

.month-card {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 8px 20px rgba(50, 50, 93, .08), 0 3px 8px rgba(0, 0, 0, .05);
  padding: 1.25rem;
  transition: transform 0.2s, box-shadow 0.2s;
}

.month-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(50, 50, 93, .15);
}

.month-card.month-empty {
  opacity: 0.55;
  background: #fafafa;
}

.month-title {
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
  margin: 0 0 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #f0f0f0;
}

.month-num {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--matery-primary);
}

.month-name {
  font-size: 0.9rem;
  color: #888;
}

.month-count {
  margin-left: auto;
  font-size: 0.75rem;
  color: #999;
  background: #f5f5f5;
  padding: 2px 8px;
  border-radius: 999px;
}

.month-posts {
  list-style: none;
  margin: 0;
  padding: 0;
}

.month-posts li {
  display: flex;
  gap: 0.5rem;
  padding: 0.4rem 0;
  align-items: baseline;
  border-bottom: 1px dashed #f0f0f0;
  font-size: 0.85rem;
}

.month-posts li:last-child { border-bottom: none; }

.post-day {
  flex-shrink: 0;
  width: 22px;
  text-align: center;
  font-weight: 600;
  color: var(--matery-primary);
  font-size: 0.9rem;
}

.post-link {
  flex: 1;
  color: var(--matery-text);
  text-decoration: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.2s;
}

.post-link:hover {
  color: var(--matery-primary);
}

.month-no-post {
  text-align: center;
  color: #ccc;
  font-size: 0.85rem;
  margin: 1rem 0;
}

.empty {
  text-align: center;
  padding: 4rem 1rem;
  color: #999;
}
</style>

