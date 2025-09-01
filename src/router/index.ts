import { useUiStore } from '@/stores/uiStore'
import { useUserStore } from '@/stores/userStore'
import HomeView from '@/views/HomeView.vue'
import TaskView from '@/views/TaskView.vue'
import WelcomeView from '@/views/WelcomeView.vue'
import { createWebHistory, createRouter } from 'vue-router'

const routes = [
  { path: '/', name: 'welcome', component: WelcomeView },

  //requires auth routes:
  { path: '/home', name: 'home', component: HomeView, meta: { requiresAuth: true } },
  { path: '/task/:id', name: 'task', component: TaskView, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const uiStore = useUiStore()

  userStore.loadUser()

  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    uiStore.openDialog('signin')
    next({ name: 'welcome' })
  } else if (to.name === 'welcome' && userStore.isAuthenticated) {
    next({ name: 'home' })
  } else {
    next()
    console.log(`Navigating to ${to.fullPath}`)
  }
})

export default router
