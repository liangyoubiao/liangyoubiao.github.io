import type { RouteRecordRaw } from 'vue-router'

export const staticRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/index.vue'),
  },
  {
    path: '/about/',
    name: 'about',
    component: () => import('@/pages/about.vue'),
  },
  {
    path: '/categories/',
    name: 'categories',
    component: () => import('@/pages/categories.vue'),
  },
  {
    path: '/tags/',
    name: 'tags',
    component: () => import('@/pages/tags.vue'),
  },
  {
    path: '/archives/',
    name: 'archives',
    component: () => import('@/pages/archives.vue'),
  },
  {
    path: '/friends/',
    name: 'friends',
    component: () => import('@/pages/friends.vue'),
  },
  {
    path: '/demos/',
    name: 'demos',
    component: () => import('@/pages/demos.vue'),
  },
  {
    path: '/contact/',
    name: 'contact',
    component: () => import('@/pages/contact.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/404.vue'),
  },
]

