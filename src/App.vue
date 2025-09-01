<script setup lang="ts">
import { onMounted } from 'vue'
import DefaultLayout from './layouts/DefaultLayout.vue'
import { useUserStore } from './stores/userStore'
import { useWorkSpaceStore } from './stores/workspaceStore'
import AuthDialog from './components/AuthDialog.vue'
import { useUiStore } from './stores/uiStore'

const userStore = useUserStore()
const wsStore = useWorkSpaceStore()
const uiStore = useUiStore()

onMounted(() => {
  wsStore.loadWorkSpaces()
  userStore.loadUser()
})
</script>

<template>
  <DefaultLayout>
    <router-view></router-view>

    <AuthDialog
      v-model:visible="uiStore.showAuthDialog"
      v-model:mode="uiStore.authMode"
      @close="uiStore.closeDialog()"
    />
  </DefaultLayout>
</template>
