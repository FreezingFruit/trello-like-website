<script lang="ts" setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
import AuthDialog from './AuthDialog.vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const showDialog = ref(false)
const formMode = ref<'signin' | 'signup'>('signin')

const userStore = useUserStore()
const router = useRouter()

const openDialog = (mode: 'signin' | 'signup') => {
  formMode.value = mode
  showDialog.value = true
}
</script>

<template>
  <nav class="container">
    <router-link :to="{ name: 'welcome' }" class="logo-link">
      <span class="logo">TRELLO CLONE</span>
    </router-link>
    <div class="nav-links">
      <router-link :to="{ name: 'home' }"><strong>Home</strong></router-link>
      <div v-if="!userStore.activeUser">
        <el-button @click="openDialog('signin')">Login</el-button>
        <el-button @click="openDialog('signup')">SignUp</el-button>
      </div>

      <div v-if="userStore.activeUser">
        <el-button
          @click="
            () => {
              userStore.logoutUser()
              router.push({ name: 'welcome' })
              ElMessage.success('Logout Successful')
            }
          "
          >Logout</el-button
        >
      </div>
    </div>

    <AuthDialog v-model:visible="showDialog" v-model:mode="formMode" />
  </nav>
</template>

<style scoped>
.container {
  background-color: white;
  padding: 2rem 4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 0 auto;
}

.logo-link {
  text-decoration: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  transition: all 0.3s ease;
  cursor: pointer;
}

.logo-link:hover {
  background-color: #f8f9fa;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #000;
  letter-spacing: 0.5px;
  transition: color 0.3s ease;
}

.logo-link:hover .logo {
  color: #0066cc;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-links a {
  color: #000;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.nav-links a:hover {
  background-color: #f5f5f5;
}

.nav-links a strong {
  font-weight: 600;
}

/* Element UI button overrides */
:deep(.el-button) {
  background-color: #000;
  border-color: #000;
  color: white;
  border-radius: 4px;
  padding: 0.5rem 1rem;
}

:deep(.el-button:hover) {
  background-color: #333;
  border-color: #333;
}

:deep(.el-button:active) {
  background-color: #000;
  border-color: #000;
}
</style>
