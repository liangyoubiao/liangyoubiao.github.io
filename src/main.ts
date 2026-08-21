import { ViteSSG } from 'vite-ssg'
import App from './App.vue'
import { staticRoutes } from './router'
import { getAllPosts, getAllTags } from './utils/posts'
import './assets/main.css'

// Build dynamic routes from Markdown content
const posts = getAllPosts()
const tags = getAllTags(posts)

const postRoutes = posts.map((post) => ({
  path: post.url,
  component: () => import('./pages/PostDetail.vue'),
}))

const tagRoutes = tags.map((tag) => ({
  path: `/tags/${encodeURIComponent(tag)}/`,
  component: () => import('./pages/TagDetail.vue'),
}))

export const createApp = ViteSSG(
  App,
  { routes: [...staticRoutes, ...postRoutes, ...tagRoutes] },
)
