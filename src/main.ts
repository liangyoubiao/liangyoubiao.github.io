import { ViteSSG } from 'vite-ssg'
import App from './App.vue'
import { staticRoutes } from './router'
import { generatedPosts, generatedTags } from './__generated_routes'
import './assets/main.css'
import './assets/matery.css'

// 由 vite.config.ts 的 generateRoutes 插件在 buildStart 时生成(每次构建自动更新)
// 不依赖 import.meta.glob 或运行时解析,直接拿到 URL 列表
const postRoutes = generatedPosts.map((post) => ({
  path: post.url,
  component: () => import('./pages/PostDetail.vue'),
}))

const tagRoutes = generatedTags.map((tag) => ({
  path: `/tags/${encodeURIComponent(tag)}/`,
  component: () => import('./pages/TagDetail.vue'),
}))

export const createApp = ViteSSG(
  App,
  { routes: [...staticRoutes, ...postRoutes, ...tagRoutes] },
)

