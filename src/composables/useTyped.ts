import { ref, onMounted, onUnmounted } from 'vue'

export interface TypedOptions {
  typeSpeed?: number
  backSpeed?: number
  startDelay?: number
  backDelay?: number
  loop?: boolean
  showCursor?: boolean
}

export function useTypedEffect(strings: string[], options: TypedOptions = {}) {
  const {
    typeSpeed = 80,
    backSpeed = 50,
    startDelay = 500,
    backDelay = 1500,
    loop = true,
    showCursor = true,
  } = options

  const text = ref('')
  const cursorVisible = ref(true)
  let stringIndex = 0
  let charIndex = 0
  let isDeleting = false
  let typeTimer: number | null = null
  let cursorTimer: number | null = null

  function tick() {
    const current = strings[stringIndex % strings.length]
    if (isDeleting) {
      charIndex--
      text.value = current.substring(0, charIndex)
    } else {
      charIndex++
      text.value = current.substring(0, charIndex)
    }

    let delay = isDeleting ? backSpeed : typeSpeed

    if (!isDeleting && charIndex === current.length) {
      delay = backDelay
      isDeleting = true
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false
      stringIndex++
      if (!loop && stringIndex >= strings.length) {
        return
      }
      delay = typeSpeed
    }

    typeTimer = window.setTimeout(tick, delay)
  }

  onMounted(() => {
    if (showCursor) {
      cursorTimer = window.setInterval(() => {
        cursorVisible.value = !cursorVisible.value
      }, 530)
    }
    typeTimer = window.setTimeout(tick, startDelay)
  })

  onUnmounted(() => {
    if (typeTimer) clearTimeout(typeTimer)
    if (cursorTimer) clearInterval(cursorTimer)
  })

  return { text, cursorVisible }
}

