<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const progress = ref(0)

function update() {
  const doc = document.documentElement
  const scrollTop = window.scrollY || doc.scrollTop
  const scrollHeight = doc.scrollHeight - doc.clientHeight
  progress.value = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0
}

onMounted(() => {
  update()
  window.addEventListener('scroll', update, { passive: true })
  window.addEventListener('resize', update)
})

onUnmounted(() => {
  window.removeEventListener('scroll', update)
  window.removeEventListener('resize', update)
})
</script>

<template>
  <div class="progress-bar" :style="{ width: progress + '%' }" aria-hidden="true"></div>
</template>

