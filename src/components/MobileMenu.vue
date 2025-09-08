<script lang="ts" setup>
import { useUserStore } from '@/stores/userStore'
import { ref } from 'vue'
import AuthDialog from './AuthDialog.vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const props = defineProps<{ visible: boolean }>()
const emits = defineEmits(['update:visible'])

const router = useRouter()

const formMode = ref<'signin' | 'signup'>('signin')
const showDialog = ref(false)

const openDialog = (mode: 'signin' | 'signup') => {
  formMode.value = mode
  showDialog.value = true
}

const userStore = useUserStore()
</script>

<template>
  <el-drawer
    title="Menu"
    :model-value="props.visible"
    direction="ltr"
    size="70%"
    :destroy-on-close="true"
    @update:modelValue="(val: boolean) => emits('update:visible', val)"
    class="modern-drawer"
  >
    <div class="drawer-content">
      <router-link :to="{ name: 'welcome' }" class="header-link">
        <h2 class="drawer-header">TRELLO CLONE</h2>
      </router-link>

      <div class="nav-links">
        <router-link :to="{ name: 'home' }" class="nav-link-item">
          <h3>HOME</h3>
        </router-link>
        <el-button v-if="!userStore.activeUser" @click="openDialog('signin')" class="nav-item">
          LOGIN
        </el-button>
        <el-button v-if="!userStore.activeUser" @click="openDialog('signup')" class="nav-item">
          REGISTER
        </el-button>
        <el-button
          v-if="userStore.activeUser"
          @click="
            () => {
              userStore.logoutUser()
              router.push({ name: 'welcome' })
              ElMessage.success('Logout successful!')
            }
          "
          class="nav-item logout-btn"
        >
          LOGOUT
        </el-button>
      </div>
    </div>

    <AuthDialog v-model:visible="showDialog" v-model:mode="formMode" />
  </el-drawer>
</template>

<style scoped>
/* Drawer styling */
:deep(.el-drawer) {
  background: #ffffff;
  box-shadow: -8px 0 25px rgba(0, 0, 0, 0.12);
}

:deep(.el-drawer__header) {
  display: none;
}

:deep(.el-drawer__body) {
  padding: 0;
  overflow-y: auto;
}

.drawer-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.header-link {
  text-decoration: none;
  display: block;
  padding: 2.5rem 1.5rem;
  background: #000000;
  transition: background-color 0.3s ease;
}

.header-link:hover {
  background: #333333;
}

.drawer-header {
  color: #ffffff;
  font-size: 1.8rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  margin: 0;
  text-align: center;
  transition: transform 0.3s ease;
}

.header-link:hover .drawer-header {
  transform: scale(1.02);
}

.nav-links {
  flex: 1;
  padding: 3rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
}

.nav-link-item {
  text-decoration: none;
  color: #000000;
  width: 85%;
  max-width: 320px;
  text-align: center;
  padding: 1.4rem 2rem;
  border: 2px solid #000000;
  border-radius: 8px;
  background: #ffffff;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.nav-link-item:hover {
  background: #000000;
  color: #ffffff;
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.nav-link-item h3 {
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  margin: 0;
  transition: color 0.3s ease;
}

.nav-item {
  width: 85%;
  max-width: 320px;
  padding: 1.4rem 2rem;
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  border: 2px solid #000000;
  border-radius: 8px;
  background: #ffffff;
  color: #000000;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

:deep(.nav-item:hover) {
  background: #000000;
  color: #ffffff;
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  border-color: #000000;
}

:deep(.nav-item:active) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.logout-btn {
  margin-top: auto;
  margin-bottom: 2rem;
  background: #000000;
  color: #ffffff;
  border-color: #000000;
}

:deep(.logout-btn:hover) {
  background: #ffffff;
  color: #000000;
  border-color: #000000;
}

@media (max-width: 768px) {
  :deep(.el-drawer) {
    width: 80% !important;
  }

  .header-link {
    padding: 2rem 1rem;
  }

  .drawer-header {
    font-size: 1.5rem;
  }

  .nav-links {
    padding: 2rem 1rem;
    gap: 1.2rem;
  }

  .nav-link-item,
  .nav-item {
    width: 95%;
    font-size: 1rem;
    padding: 1.2rem 1.5rem;
  }
}

@media (max-width: 480px) {
  :deep(.el-drawer) {
    width: 90% !important;
  }

  .drawer-header {
    font-size: 1.3rem;
  }

  .nav-link-item,
  .nav-item {
    width: 100%;
    padding: 1rem 1.2rem;
  }
}

:deep(.el-drawer__body)::-webkit-scrollbar {
  width: 4px;
}

:deep(.el-drawer__body)::-webkit-scrollbar-track {
  background: #f0f0f0;
}

:deep(.el-drawer__body)::-webkit-scrollbar-thumb {
  background: #666666;
  border-radius: 2px;
}

:deep(.el-drawer__body)::-webkit-scrollbar-thumb:hover {
  background: #333333;
}
</style>
