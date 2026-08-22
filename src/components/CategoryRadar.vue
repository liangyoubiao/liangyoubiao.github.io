<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as echarts from 'echarts/core'
import { RadarChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { getAllPosts } from '@/utils/posts'

echarts.use([RadarChart, TitleComponent, TooltipComponent, CanvasRenderer])

interface CategoryStat { name: string; count: number }

const props = defineProps<{ max?: number }>()
const max = props.max ?? 6

const chartEl = ref<HTMLDivElement | null>(null)
let chart: echarts.ECharts | null = null

const categories = ref<CategoryStat[]>([])

function loadData() {
  const posts = getAllPosts()
  const map: Record<string, number> = {}
  for (const p of posts) {
    const cats = Array.isArray(p.categories) ? p.categories : p.categories ? [p.categories] : []
    for (const c of cats) {
      if (c) map[c] = (map[c] || 0) + 1
    }
  }
  const all = Object.entries(map)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
  categories.value = all.slice(0, max)
}

function initChart() {
  if (!chartEl.value || !categories.value.length) return
  if (chart) chart.dispose()
  chart = echarts.init(chartEl.value, undefined, { renderer: 'canvas' })

  const indicator = categories.value.map((c) => ({ name: c.name, max: Math.max(c.count + 1, 3) }))

  chart.setOption({
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(50, 50, 50, 0.9)',
      borderColor: 'transparent',
      textStyle: { color: '#fff', fontSize: 12 },
      formatter: (p) => `${p.name}<br/>文章: <b>${p.value[0]}</b>`,
    },
    radar: {
      indicator,
      shape: 'polygon',
      splitNumber: 3,
      center: ['50%', '55%'],
      radius: '65%',
      axisName: { color: '#666', fontSize: 11 },
      splitArea: { areaStyle: { color: ['rgba(15, 157, 88, 0.04)', 'rgba(15, 157, 88, 0.02)'] } },
      splitLine: { lineStyle: { color: 'rgba(15, 157, 88, 0.15)' } },
      axisLine: { lineStyle: { color: 'rgba(15, 157, 88, 0.15)' } },
    },
    series: [
      {
        type: 'radar',
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { color: '#0f9d58', width: 2 },
        itemStyle: { color: '#0f9d58' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: 'rgba(76, 191, 48, 0.4)' },
            { offset: 1, color: 'rgba(15, 157, 88, 0.2)' },
          ]),
        },
        data: [
          {
            name: '文章分布',
            value: categories.value.map((c) => c.count),
          },
        ],
      },
    ],
  })
}

function handleResize() {
  chart?.resize()
}

onMounted(() => {
  loadData()
  initChart()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  chart?.dispose()
  chart = null
})

watch(categories, () => initChart())
</script>

<template>
  <section class="radar-widget">
    <h3 class="widget-title">
      <i class="fas fa-radar"></i>
      <span>分类雷达</span>
    </h3>
    <p v-if="!categories.length" class="empty">暂无分类数据</p>
    <div v-else ref="chartEl" class="radar-chart" />
  </section>
</template>

<style scoped>
.radar-widget {
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
  margin: 0 0 0.5rem;
  color: var(--matery-text);
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 0.6rem;
}

.widget-title i { color: var(--matery-primary); }

.empty {
  color: #888;
  font-size: 0.9rem;
  text-align: center;
  margin: 1.5rem 0;
}

.radar-chart {
  width: 100%;
  height: 260px;
}
</style>

