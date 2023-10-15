import type { App } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import { setupPageGuard } from './permission'
import { ChatLayout } from '@/views/chat/layout'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
  },
  {
    path: '/test',
    name: 'test',
    component:() => import('@/views/test.vue')
  },
  {
    path: '/chat/group',
    name: 'Group',
    component: () => import('@/views/Groups.vue')
  },
  {
    path: '/charge',
    name: 'Charge',
    component:() => import('@/views/Charge.vue')
  },
  {
    path: '/learn',
    name: 'Learn',
    component:() => import('@/views/Charge.vue')
  },
  {
    path: '/plan',
    name: 'Plan',
    component:() => import('@/views/Charge.vue')
  },
  {
    path: '/video',
    name: 'Video',
    component:() => import('@/views/Charge.vue')
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/views/Q&A.vue')
  },
  {
    path: '/chat',
    name: 'Chat',
    redirect: '/chat',
    component: ChatLayout,
    children: [
      {
        path: '/chat/:type/:uuid?',
        name: 'ChatSub',
        component: () => import('@/views/chat/index.vue'),
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/exception/404/index.vue'),
  },

  {
    path: '/500',
    name: '500',
    component: () => import('@/views/exception/500/index.vue'),
  },

  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    redirect: '/404',
  },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

setupPageGuard(router)

export async function setupRouter(app: App) {
  app.use(router)
  await router.isReady()
}
