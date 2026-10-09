<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed } from 'vue'
import { useScreenLock } from '../composables/useScreenLock'

const { isLocked, unlock } = useScreenLock()

let prevOverflow = ''
let originalTitle = ''
let faviconLinks: HTMLLinkElement[] = []
let originalFaviconHrefs: string[] = []
let originalsCaptured = false

const now = ref(Date.now())
let clockTimer: number | null = null

const timeText = computed(() => {
  const d = new Date(now.value)
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`
})

const dateText = computed(() => {
  const d = new Date(now.value)
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
})

const weekdayText = computed(() => {
  const names = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return names[new Date(now.value).getDay()]
})

function captureOriginals() {
  if (originalsCaptured) return
  originalsCaptured = true
  originalTitle = document.title
  faviconLinks = Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel*="icon"]'))
  originalFaviconHrefs = faviconLinks.map(l => l.href)
}

function applyLockedChrome() {
  captureOriginals()
  document.title = '屏幕已锁定 · LiangYouBiao 的博客'
  faviconLinks.forEach(l => { l.href = '/screen-lock-logo.png' })
}

function restoreOriginalChrome() {
  if (!originalsCaptured) return
  document.title = originalTitle
  faviconLinks.forEach((l, i) => {
    const orig = originalFaviconHrefs[i]
    if (orig !== undefined) l.href = orig
  })
}

onMounted(() => {
  now.value = Date.now()

  watch(isLocked, (locked) => {
    if (locked) {
      prevOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      applyLockedChrome()
      if (clockTimer == null) {
        clockTimer = window.setInterval(() => { now.value = Date.now() }, 30_000)
      }
    } else {
      document.body.style.overflow = prevOverflow
      restoreOriginalChrome()
      if (clockTimer != null) {
        clearInterval(clockTimer)
        clockTimer = null
      }
    }
  }, { immediate: true })
})

function onLogoClick(e: MouseEvent) {
  e.preventDefault()
}

function onLogoDblClick(e: MouseEvent) {
  e.preventDefault()
  unlock()
}

onUnmounted(() => {
  document.body.style.overflow = prevOverflow
  restoreOriginalChrome()
  if (clockTimer != null) {
    clearInterval(clockTimer)
    clockTimer = null
  }
})
</script>

<template>
  <Teleport to="body">
    <div v-if="isLocked" class="screen-lock">
      <div class="lock-bg">
        <div class="lock-bg-blur lock-bg-blur-1"></div>
        <div class="lock-bg-blur lock-bg-blur-2"></div>
        <div class="lock-bg-blur lock-bg-blur-3"></div>
      </div>

      <div class="lock-content">
        <div class="time-block">
          <div class="time">{{ timeText }}</div>
          <div class="date">{{ dateText }} · {{ weekdayText }}</div>
        </div>

        <div class="lock-card">
          <div class="lock-icon-row">
            <svg class="lock-icon" viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 1a5 5 0 0 0-5 5v4H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2h-1V6a5 5 0 0 0-5-5zm-3 5a3 3 0 1 1 6 0v4H9V6zm3 7a2 2 0 0 1 1.732 3l-1.732 1.732L11 17.732A2 2 0 0 1 12 13z"
              />
            </svg>
          </div>
          <h1 class="lock-title">已锁定</h1>
          <p class="lock-hint">检测到长时间无操作,内容已临时屏蔽</p>

          <a
            href="/"
            class="lock-logo"
            aria-label="解锁"
            @click="onLogoClick"
            @dblclick="onLogoDblClick"
            draggable="false"
          >
            <img
              width="48"
              height="48"
              alt=""
              src="/screen-lock-logo.png"
              draggable="false"
            />
            <span class="unlock-tip">双击解锁</span>
          </a>
        </div>

        <p class="footer-tip">© LiangYouBiao · 记录学习与生活的点滴</p>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.screen-lock {
  position: fixed;
  inset: 0;
  z-index: 9999;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC",
    "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
}

.lock-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #1a1d2e 0%, #2d3142 50%, #1a1d2e 100%);
  z-index: 0;
}

.lock-bg-blur {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.45;
}

.lock-bg-blur-1 {
  width: 480px;
  height: 480px;
  background: #4cbf30;
  top: -120px;
  left: -120px;
}

.lock-bg-blur-2 {
  width: 420px;
  height: 420px;
  background: #0f9d58;
  bottom: -100px;
  right: -100px;
}

.lock-bg-blur-3 {
  width: 360px;
  height: 360px;
  background: #6c5ce7;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.3;
}

.lock-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.8rem;
  width: min(420px, calc(100vw - 32px));
  text-align: center;
}

.time-block {
  color: rgba(255, 255, 255, 0.92);
  user-select: none;
}

.time {
  font-size: 4.5rem;
  font-weight: 200;
  letter-spacing: -2px;
  line-height: 1;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  font-variant-numeric: tabular-nums;
}

.date {
  margin-top: 0.6rem;
  font-size: 0.95rem;
  font-weight: 300;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.6);
}

.lock-card {
  width: 100%;
  padding: 2rem 1.5rem 1.6rem;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  box-sizing: border-box;
}

.lock-icon-row {
  display: flex;
  justify-content: center;
  margin-bottom: 0.8rem;
}

.lock-icon {
  color: #4cbf30;
  filter: drop-shadow(0 2px 8px rgba(76, 191, 48, 0.4));
}

.lock-title {
  margin: 0 0 0.4rem;
  font-size: 1.6rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.95);
  letter-spacing: 1px;
}

.lock-hint {
  margin: 0 0 1.4rem;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.55);
  line-height: 1.5;
}

.lock-logo {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  text-decoration: none;
  user-select: none;
  -webkit-user-drag: none;
  padding: 8px;
  border-radius: 12px;
  transition: background 0.2s, transform 0.2s;
}

.lock-logo:hover {
  background: rgba(255, 255, 255, 0.06);
}

.lock-logo:active {
  transform: scale(0.96);
}

.lock-logo img {
  display: block;
  width: 48px;
  height: 48px;
  user-select: none;
  -webkit-user-drag: none;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.4));
  animation: lock-pulse 2.4s ease-in-out infinite;
}

.unlock-tip {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 1px;
}

.footer-tip {
  margin: 0;
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.35);
  letter-spacing: 0.5px;
}

@keyframes lock-pulse {
  0%, 100% {
    opacity: 0.85;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
}

@media (max-width: 480px) {
  .time {
    font-size: 3.6rem;
  }
  .lock-card {
    padding: 1.6rem 1.2rem 1.4rem;
  }
}
</style>
