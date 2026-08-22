<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Post } from '@/utils/posts'

const props = defineProps<{ posts: Post[] }>()

const now = new Date()
const year = ref(now.getFullYear())
const month = ref(now.getMonth() + 1) // 1-12

const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
const weekdayNames = ['日', '一', '二', '三', '四', '五', '六']

const daysInMonth = computed(() => new Date(year.value, month.value, 0).getDate())

const firstWeekday = computed(() => new Date(year.value, month.value - 1, 1).getDay()) // 0(Sun) - 6(Sat)

// 收集当月每天的文章数
const postsByDay = computed(() => {
  const map: Record<number, Post[]> = {}
  for (const p of props.posts) {
    const d = new Date(p.date)
    if (d.getFullYear() === year.value && d.getMonth() + 1 === month.value) {
      const day = d.getDate()
      ;(map[day] ??= []).push(p)
    }
  }
  return map
})

const cells = computed(() => {
  const result: Array<{ day: number | null; posts: Post[] }> = []
  // 前导空格
  for (let i = 0; i < firstWeekday.value; i++) result.push({ day: null, posts: [] })
  // 当月日期
  for (let d = 1; d <= daysInMonth.value; d++) {
    result.push({ day: d, posts: postsByDay.value[d] || [] })
  }
  return result
})

function prevMonth() {
  if (month.value === 1) { year.value--; month.value = 12 } else { month.value-- }
}
function nextMonth() {
  if (month.value === 12) { year.value++; month.value = 1 } else { month.value++ }
}

const isToday = (day: number) => {
  return day === now.getDate() && month.value === now.getMonth() + 1 && year.value === now.getFullYear()
}

const hasPost = (day: number | null) => day != null && (postsByDay.value[day]?.length ?? 0) > 0
</script>

<template>
  <section class="calendar-widget">
    <h3 class="widget-title">
      <i class="far fa-calendar-alt"></i>
      <span>文章归档</span>
    </h3>
    <div class="cal-header">
      <button class="cal-nav" @click="prevMonth" aria-label="上一月">‹</button>
      <span class="cal-period">{{ year }} 年 {{ month }} 月</span>
      <button class="cal-nav" @click="nextMonth" aria-label="下一月">›</button>
    </div>
    <div class="cal-weekdays">
      <span v-for="d in weekdayNames" :key="d" class="cal-weekday">{{ d }}</span>
    </div>
    <div class="cal-grid">
      <div
        v-for="(c, i) in cells"
        :key="i"
        :class="['cal-cell', !c.day && 'cal-empty', c.day && hasPost(c.day) && 'cal-has-post', c.day && isToday(c.day) && 'cal-today']"
      >
        <span v-if="c.day" class="cal-day">{{ c.day }}</span>
        <span v-if="c.day && hasPost(c.day)" class="cal-dot" :title="c.posts.map(p => p.title).join('\n')"></span>
      </div>
    </div>
    <div class="cal-foot">
      <RouterLink to="/calendar/" class="cal-more">查看完整日历 →</RouterLink>
    </div>
  </section>
</template>

<style scoped>
.calendar-widget {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(50, 50, 93, .08), 0 4px 10px rgba(0, 0, 0, .05);
  padding: 1.25rem 1.25rem 1rem;
}

.widget-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.05rem;
  margin: 0 0 1rem;
  color: var(--matery-text);
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 0.6rem;
}

.widget-title i { color: var(--matery-primary); }

.cal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.cal-period {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--matery-text);
}

.cal-nav {
  background: transparent;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  width: 28px;
  height: 28px;
  font-size: 1.1rem;
  line-height: 1;
  cursor: pointer;
  color: #888;
  transition: all 0.2s;
}

.cal-nav:hover {
  border-color: var(--matery-primary);
  color: var(--matery-primary);
  background: #f0f7ff;
}

.cal-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-size: 0.7rem;
  color: #aaa;
  margin-bottom: 0.25rem;
}

.cal-weekday { padding: 0.2rem 0; }

.cal-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.cal-cell {
  position: relative;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  color: #555;
  border-radius: 6px;
  transition: all 0.15s;
}

.cal-cell.cal-empty { background: transparent; }

.cal-cell:not(.cal-empty):hover {
  background: #f0f7ff;
  color: var(--matery-primary);
  cursor: pointer;
}

.cal-cell.cal-today {
  background: var(--matery-gradient);
  color: #fff;
  font-weight: 600;
}

.cal-cell.cal-today:hover {
  color: #fff;
}

.cal-day { z-index: 1; }

.cal-dot {
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--matery-primary);
}

.cal-cell.cal-today .cal-dot { background: #fff; }

.cal-foot {
  margin-top: 0.75rem;
  text-align: center;
}

.cal-more {
  font-size: 0.8rem;
  color: var(--matery-primary);
  text-decoration: none;
}

.cal-more:hover { text-decoration: underline; }
</style>

