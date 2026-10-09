<script setup lang="ts">
import { watch, onMounted, onUnmounted } from 'vue'
import { useScreenLock } from '../composables/useScreenLock'

const { isLocked, unlock } = useScreenLock()

let prevOverflow = ''

let originalTitle = ''
let faviconLinks: HTMLLinkElement[] = []
let originalFaviconHrefs: string[] = []
let originalsCaptured = false

function captureOriginals() {
  if (originalsCaptured) return
  originalsCaptured = true
  originalTitle = document.title
  faviconLinks = Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel*="icon"]'))
  originalFaviconHrefs = faviconLinks.map(l => l.href)
}

function applyLockedChrome() {
  captureOriginals()
  document.title = 'Site not found · GitHub Pages'
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

function onLogoClick(e: MouseEvent) {
  e.preventDefault()
}

function onLogoDblClick(e: MouseEvent) {
  e.preventDefault()
  unlock()
}

// 锁屏副作用只在客户端执行,服务端渲染没有 document
onMounted(() => {
  watch(isLocked, (locked) => {
    if (locked) {
      prevOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      applyLockedChrome()
    } else {
      document.body.style.overflow = prevOverflow
      restoreOriginalChrome()
    }
  }, { immediate: true })
})

onUnmounted(() => {
  document.body.style.overflow = prevOverflow
  restoreOriginalChrome()
})
</script>

<template>
  <Teleport to="body">
    <div v-if="isLocked" class="screen-lock">
      <div class="container">
        <h1>404</h1>
        <p><strong>There isn't a GitHub Pages site here.</strong></p>
        <p>
          If you're trying to publish one,
          <a href="https://help.github.com/pages/" target="_blank" rel="noopener noreferrer">read the full documentation</a>
          to learn how to set up <strong>GitHub Pages</strong>
          for your repository, organization, or user account.
        </p>
        <div id="suggestions">
          <a href="https://www.githubstatus.com/" target="_blank" rel="noopener noreferrer">GitHub Status</a>
          —
          <a href="https://twitter.com/githubstatus" target="_blank" rel="noopener noreferrer">@githubstatus</a>
        </div>

        <a
          href="/"
          class="logo"
          aria-label="logo"
          @click="onLogoClick"
          @dblclick="onLogoDblClick"
          draggable="false"
        >
          <img width="32" height="32" alt="" src="/screen-lock-logo.png" draggable="false" />
        </a>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.screen-lock {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: #f1f1f1;
  color: #24292e;
  overflow-y: auto;
}

.container {
  width: 540px;
  max-width: calc(100vw - 40px);
  margin: 0 auto;
  padding: 70px 0 50px;
  text-align: center;
  position: relative;
  box-sizing: border-box;
}

h1 {
  letter-spacing: -1px;
  line-height: 60px;
  font-size: 60px;
  font-weight: 100;
  margin: 0 0 50px 0;
  text-shadow: 0 1px 0 #fff;
  color: #24292e;
}

p {
  margin: 20px 0;
  line-height: 1.6;
  color: rgba(0, 0, 0, 0.5);
}

p strong {
  font-weight: 600;
}

a {
  color: #0366d6;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

#suggestions {
  margin-top: 16px;
  font-size: 14px;
  color: #24292e;
}

#suggestions a {
  color: #666666;
  font-weight: 200;
  font-size: 14px;
  margin: 0 10px;
}

.logo {
  display: block;
  width: 32px;
  height: 32px;
  margin: 32px auto 0;
  cursor: pointer;
  user-select: none;
  -webkit-user-drag: none;
}

.logo img {
  display: block;
  width: 32px;
  height: 32px;
  user-select: none;
  -webkit-user-drag: none;
}
</style>