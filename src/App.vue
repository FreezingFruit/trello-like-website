<script setup lang="ts">
import { onMounted } from 'vue'
import DefaultLayout from './layouts/DefaultLayout.vue'
import { useUserStore } from './stores/userStore'
import { useWorkSpaceStore } from './stores/workspaceStore'

const userStore = useUserStore()
const wsStore = useWorkSpaceStore()

onMounted(() => {
  wsStore.loadWorkSpaces()
  userStore.loadUser()
})
</script>

<template>
  <DefaultLayout>
    <router-view></router-view>
  </DefaultLayout>
</template>
