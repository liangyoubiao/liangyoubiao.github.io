<script setup lang="ts">
import { useTypedEffect } from '@/composables/useTyped'
import { site } from '@/utils/site'

interface Props {
  title?: string
  subtitle?: string | string[]
  postTitle?: boolean
  height?: 'index' | 'post'
  banners?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  title: site.title,
  subtitle: () => site.subtitle as string | string[],
  postTitle: false,
  height: 'index',
  banners: () => site.banners,
})

const subList = Array.isArray(props.subtitle) ? props.subtitle : [props.subtitle || site.description]
const { text, cursorVisible } = useTypedEffect(subList, {
  typeSpeed: 90,
  backSpeed: 50,
  startDelay: 800,
  backDelay: 1800,
  loop: true,
})

function scrollDown(e: Event) {
  e.preventDefault()
  const main = document.querySelector('.site-main, #articles, .content, main')
  if (main) {
    main.scrollIntoView({ behavior: 'smooth' })
  } else {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
  }
}
</script>

<template>
  <header :class="['bg-cover', height === 'post' ? 'post-cover' : 'index-cover']">
    <div v-if="!postTitle && banners?.length" class="bg-stack" aria-hidden="true">
      <div
        v-for="(src, i) in banners"
        :key="i"
        class="bg-slide"
        :style="{
          backgroundImage: `url(${src})`,
          animationDelay: `${i * 6}s`,
        }"
      />
      <div class="bg-mask" />
    </div>
    <div v-else-if="height === 'post'" class="bg-static" aria-hidden="true">
      <div class="bg-mask" />
    </div>

    <div class="container">
      <div v-if="!postTitle" class="brand">
        <div class="title center-align">{{ title }}</div>
        <div class="description center-align">
          <span>{{ text }}</span><span v-if="cursorVisible" class="typed-cursor">|</span>
        </div>
      </div>
      <div v-else class="brand">
        <div class="post-title center-align">{{ title }}</div>
      </div>

      <div v-if="!postTitle" class="cover-btns">
        <a href="#articles" @click="scrollDown" class="waves-effect">
          <span>开始阅读</span>
          <span style="margin-left: 0.5rem">↓</span>
        </a>
        <a :href="site.githubUrl" target="_blank" rel="noopener">
          <span>GitHub</span>
        </a>
      </div>

      <div v-if="!postTitle" class="cover-social-link">
        <a v-for="s in site.socials" :key="s.name" :href="s.url" target="_blank" rel="noopener" :title="s.name">
          {{ s.icon }}
        </a>
      </div>
    </div>

    <a v-if="!postTitle" href="#articles" class="scroll-down" @click="scrollDown" aria-label="向下滚动">
      ⌄
    </a>
  </header>
</template>

<style scoped>
.brand {
  padding: 0 1.5rem;
}

.typed-cursor {
  display: inline-block;
  margin-left: 2px;
  font-weight: 100;
  color: #fff;
  animation: blink 0.7s infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

/* ====== 轮播背景层(7 张图 6s 循环交叉淡入) ====== */
.bg-stack {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
}

.bg-slide {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: 0;
  animation: bgCrossfade 42s infinite;
  transform: scale(1.05);
  transition: transform 8s ease-out;
}

@keyframes bgCrossfade {
  0%, 4% { opacity: 0; transform: scale(1); }
  8%, 14% { opacity: 1; transform: scale(1.05); }
  18%, 100% { opacity: 0; transform: scale(1.08); }
}

.bg-mask {
  position: absolute;
  inset: 0;
  background: rgba(45, 45, 45, .4);
  z-index: 1;
}

.bg-static {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: var(--matery-gradient);
}

.bg-cover > .container {
  position: relative;
  z-index: 3;
}

@media (max-width: 768px) {
  .bg-cover .title { font-size: 2.5rem; }
  .bg-cover .post-title { font-size: 1.75rem; }
  .bg-cover .description { font-size: 1rem; }
  .cover-btns a {
    margin: 6px 6px;
    padding: 0 20px;
    height: 38px;
    line-height: 38px;
    font-size: 0.9rem;
  }
}
</style>

