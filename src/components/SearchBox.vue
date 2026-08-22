<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useSearch } from '@/composables/useSearch'

const { query, results, load, ready } = useSearch()
const router = useRouter()

const open = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)
const activeIdx = ref(0)

watch(results, () => { activeIdx.value = 0 })

function show() {
  open.value = true
  load()
  setTimeout(() => inputRef.value?.focus(), 30)
}

function hide() {
  open.value = false
  query.value = ''
}

function go(url: string) {
  hide()
  router.push(url)
}

function onKeydown(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    if (open.value) hide()
    else show()
    return
  }
  if (!open.value) return
  if (e.key === 'Escape') {
    e.preventDefault()
    hide()
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    activeIdx.value = Math.min(activeIdx.value + 1, results.value.length - 1)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    activeIdx.value = Math.max(activeIdx.value - 1, 0)
  } else if (e.key === 'Enter') {
    e.preventDefault()
    const target = results.value[activeIdx.value]
    if (target) go(target.url)
  }
}

function onBackdropClick(e: MouseEvent) {
  if (e.target === e.currentTarget) hide()
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
})
</script>

<template>
  <button class="search-trigger" @click="show" aria-label="搜索" title="搜索 (Ctrl/⌘ + K)">
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
    <span class="search-hint">Ctrl K</span>
  </button>

  <Teleport to="body">
    <div v-if="open" class="search-backdrop" @click="onBackdropClick">
      <div class="search-panel" role="dialog" aria-modal="true">
        <div class="search-input-wrap">
          <svg class="search-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref="inputRef"
            v-model="query"
            type="text"
            placeholder="搜索文章 (标题/标签/内容)..."
            class="search-input"
            autocomplete="off"
            spellcheck="false"
          />
          <kbd class="search-kbd">ESC</kbd>
        </div>

        <div class="search-results">
          <p v-if="!ready" class="search-status">加载索引中...</p>
          <p v-else-if="!query.trim()" class="search-status">输入关键词开始搜索</p>
          <p v-else-if="!results.length" class="search-status">没有找到匹配 “{{ query }}” 的文章</p>

          <!-- 骨架屏:索引加载时显示 -->
          <ul v-else-if="!ready" class="search-skeleton">
            <li v-for="i in 3" :key="i" class="skeleton-item">
              <div class="sk-icon sk" />
              <div class="sk-body">
                <div class="sk-line sk sk-50" />
                <div class="sk-line sk sk-90" />
                <div class="sk-line sk sk-30" />
              </div>
            </li>
          </ul>

          <Transition name="search-result" mode="out-in">
            <ul v-if="results.length" :key="query">
              <li
                v-for="(r, i) in results"
                :key="r.url"
                :class="{ 'is-active': i === activeIdx }"
                @mouseenter="activeIdx = i"
                @click="go(r.url)"
              >
                <div class="result-icon">📄</div>
                <div class="result-body">
                  <h4>{{ r.title }}</h4>
                  <p>{{ r.summary }}</p>
                  <div class="result-meta">
                    <time>{{ r.date }}</time>
                    <span v-for="t in r.tags.slice(0, 3)" :key="t" class="result-tag">#{{ t }}</span>
                  </div>
                </div>
              </li>
            </ul>
          </Transition>
        </div>

        <div class="search-footer">
          <span><kbd>↑</kbd><kbd>↓</kbd> 切换</span>
          <span><kbd>↵</kbd> 打开</span>
          <span><kbd>ESC</kbd> 关闭</span>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.search-trigger {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: var(--matery-bg, #f5f5f5);
  border: 1px solid var(--matery-border, #e0e0e0);
  color: var(--matery-text, #34495e);
  padding: 0.4rem 0.75rem;
  border-radius: 999px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: background 0.2s, border-color 0.2s;
}

.search-trigger:hover {
  background: #fff;
  border-color: var(--matery-primary, #0f9d58);
  color: var(--matery-primary, #0f9d58);
}

.search-hint {
  font-size: 0.7rem;
  opacity: 0.7;
}

@media (max-width: 640px) {
  .search-hint { display: none; }
}

.search-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 9999;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 10vh;
  backdrop-filter: blur(2px);
}

.search-panel {
  width: 90%;
  max-width: 640px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 70vh;
}

.search-input-wrap {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 1rem;
  border-bottom: 1px solid #eee;
}

.search-icon { color: #888; flex-shrink: 0; }

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 1rem;
  color: #2c3e50;
  background: transparent;
  font-family: inherit;
}

.search-kbd {
  font-size: 0.7rem;
  padding: 2px 6px;
  border: 1px solid #ccc;
  border-radius: 3px;
  background: #f8f8f8;
  color: #666;
}

.search-results {
  flex: 1;
  overflow-y: auto;
  min-height: 120px;
}

.search-status {
  text-align: center;
  color: #888;
  padding: 2rem 1rem;
  margin: 0;
  font-size: 0.9rem;
}

.search-results ul {
  list-style: none;
  margin: 0;
  padding: 0.5rem 0;
}

.search-results li {
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  border-left: 3px solid transparent;
  transition: background 0.15s;
}

.search-results li.is-active {
  background: #f0f7ff;
  border-left-color: var(--matery-primary, #0f9d58);
}

.result-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--matery-bg, #f5f5f5);
  border-radius: 8px;
}

.result-body { flex: 1; min-width: 0; }
.result-body h4 { margin: 0 0 0.2rem; font-size: 0.95rem; color: #2c3e50; }
.result-body p {
  margin: 0 0 0.4rem;
  font-size: 0.82rem;
  color: #666;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.result-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.72rem;
  color: #999;
}

.result-tag {
  color: var(--matery-primary, #0f9d58);
}

/* 搜索结果切换动画 */
.search-result-enter-active,
.search-result-leave-active {
  transition: opacity 0.15s, transform 0.15s;
}
.search-result-enter-from {
  opacity: 0;
  transform: translateY(4px);
}
.search-result-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* 骨架屏 */
.search-skeleton {
  list-style: none;
  margin: 0;
  padding: 0.5rem 0;
}

.skeleton-item {
  display: flex;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
}

.sk {
  background: linear-gradient(90deg, #f0f0f0 0%, #e8e8e8 50%, #f0f0f0 100%);
  background-size: 200% 100%;
  border-radius: 4px;
  animation: sk-shimmer 1.2s ease-in-out infinite;
}

.sk-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  flex-shrink: 0;
}

.sk-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.sk-line { height: 12px; }
.sk-50 { width: 50%; }
.sk-30 { width: 30%; }
.sk-90 { width: 90%; }

@keyframes sk-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@media (prefers-reduced-motion: reduce) {
  .sk { animation: none; background: #f0f0f0; }
}

.search-footer {
  display: flex;
  gap: 1rem;
  padding: 0.5rem 1rem;
  border-top: 1px solid #eee;
  background: #fafafa;
  font-size: 0.75rem;
  color: #888;
}

.search-footer kbd {
  display: inline-block;
  padding: 1px 5px;
  margin-right: 0.25rem;
  font-size: 0.7rem;
  border: 1px solid #ccc;
  border-radius: 3px;
  background: #fff;
  color: #666;
  font-family: monospace;
}
</style>

