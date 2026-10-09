import { ref, onMounted, onUnmounted } from 'vue'

const TIMEOUT_MS = 30 * 60 * 1000
const CLICK_EXTEND_MS = 10 * 60 * 1000

export const PATTERN_PASSWORD = [4, 2, 3, 5, 7, 8, 6] as const

let lockDeadline: number | null = null
const isLocked = ref(true)
let intervalId: number | null = null
let clickHandler: ((e: MouseEvent) => void) | null = null
let installed = false

function evaluateLockState() {
  if (lockDeadline == null) {
    isLocked.value = true
    return
  }
  isLocked.value = Date.now() > lockDeadline
}

function unlock() {
  lockDeadline = Date.now() + TIMEOUT_MS
  isLocked.value = false
}

function onPageClick() {
  if (isLocked.value) return
  if (lockDeadline == null) return
  lockDeadline += CLICK_EXTEND_MS
}

export function useScreenLock() {
  onMounted(() => {
    if (installed) return
    installed = true
    evaluateLockState()
    clickHandler = onPageClick
    document.addEventListener('click', clickHandler, { capture: true })
    intervalId = window.setInterval(evaluateLockState, 60_000)
  })

  onUnmounted(() => {
    if (clickHandler) {
      document.removeEventListener('click', clickHandler, { capture: true })
      clickHandler = null
    }
    if (intervalId != null) {
      clearInterval(intervalId)
      intervalId = null
    }
    installed = false
  })

  return {
    isLocked,
    passwordLength: PATTERN_PASSWORD.length,
    unlock,
  }
}