<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

interface LightboxState {
  open: boolean
  src: string
  alt: string
}

const state = ref<LightboxState>({ open: false, src: '', alt: '' })
let prevOverflow = ''

function open(src: string, alt: string) {
  state.value = { open: true, src, alt }
  prevOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
}

function close() {
  state.value = { open: false, src: '', alt: '' }
  document.body.style.overflow = prevOverflow
}

function onBackdropClick(e: MouseEvent) {
  if (e.target === e.currentTarget) close()
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && state.value.open) close()
}

function onWheel(e: WheelEvent) {
  e.preventDefault()
  const img = document.querySelector('.lightbox-img') as HTMLImageElement | null
  if (!img) return
  const cur = parseFloat(img.style.transform.replace('scale(', '').replace(')', '') || '1')
  const next = Math.max(0.5, Math.min(3, cur + (e.deltaY < 0 ? 0.15 : -0.15)))
  img.style.transform = `scale(${next})`
}

function onGlobalClick(e: Event) {
  const a = (e.target as HTMLElement).closest('a.lightbox-item') as HTMLAnchorElement | null
  if (!a) return
  e.preventDefault()
  const img = a.querySelector('img')
  if (!img) return
  open(a.href, img.alt)
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
  document.addEventListener('click', onGlobalClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  document.removeEventListener('click', onGlobalClick)
  document.body.style.overflow = prevOverflow
})
</script>

<template>
  <Teleport to="body">
    <Transition name="lightbox-fade">
      <div
        v-if="state.open"
        class="lightbox-backdrop"
        @click="onBackdropClick"
        @wheel.prevent="onWheel"
      >
        <img :src="state.src" :alt="state.alt" class="lightbox-img" />
        <button class="lightbox-close" type="button" @click="close" aria-label="关闭">×</button>
        <div v-if="state.alt" class="lightbox-caption">{{ state.alt }}</div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.lightbox-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.94);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: zoom-out;
  padding: 3rem;
}

.lightbox-img {
  max-width: 95vw;
  max-height: 90vh;
  object-fit: contain;
  cursor: default;
  border-radius: 4px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  transition: transform 0.2s ease;
}

.lightbox-close {
  position: absolute;
  top: 1rem;
  right: 1.5rem;
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  border: none;
  font-size: 2.2rem;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  cursor: pointer;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  font-weight: 200;
}

.lightbox-close:hover {
  background: rgba(255, 255, 255, 0.25);
}

.lightbox-caption {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.9rem;
  max-width: 80vw;
  text-align: center;
  background: rgba(0, 0, 0, 0.4);
  padding: 0.5rem 1rem;
  border-radius: 6px;
}

.lightbox-fade-enter-active,
.lightbox-fade-leave-active {
  transition: opacity 0.2s;
}

.lightbox-fade-enter-from,
.lightbox-fade-leave-to {
  opacity: 0;
}
</style>

