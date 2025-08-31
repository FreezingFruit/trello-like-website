import HomeView from '@/views/HomeView.vue'
import TaskView from '@/views/TaskView.vue'
import WelcomeView from '@/views/WelcomeView.vue'
import { createWebHistory, createRouter } from 'vue-router'

const routes = [
  { path: '/home', name: 'home', component: HomeView },
  { path: '/task/:id', name: 'task', component: TaskView },
  { path: '/', name: 'welcome', component: WelcomeView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
