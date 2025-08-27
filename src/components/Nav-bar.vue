<script lang="ts" setup>
import { ref } from 'vue'
import SignInDialog from './SignInDialog.vue'
import SignUpDialog from './SignUpDialog.vue'
import { useUserStore } from '@/stores/userStore'

const showSignIn = ref(false)
const showSignUp = ref(false)

const userStore = useUserStore()
</script>

<template>
  <nav class="container">
    <span class="logo">TRELLO CLONE</span>
    <div class="nav-links">
      <router-link :to="{ name: 'home' }"><strong>Home</strong></router-link>
      <div v-if="!userStore.activeUser">
        <el-button @click="showSignIn = true">Login</el-button>
        <el-button @click="showSignUp = true">SignUp</el-button>
      </div>

      <div v-if="userStore.activeUser">
        <el-button @click="userStore.logoutUser">Logout</el-button>
      </div>
    </div>

    <SignInDialog v-model:visible="showSignIn" />
    <SignUpDialog v-model:visible="showSignUp" />
  </nav>
</template>

<style scoped>
.container {
  background-color: white;
  padding: 2rem 4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #000;
  letter-spacing: 0.5px;
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
