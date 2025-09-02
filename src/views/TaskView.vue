<script lang="ts" setup>
import TaskCards from '@/components/TaskCards.vue'
import { useWorkSpaceStore } from '@/stores/workspaceStore'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import ManageMemberDrawer from '@/components/ManageMemberDrawer.vue'

const wsStore = useWorkSpaceStore()
const route = useRoute()

const workspaceId = Number(route.params.id)
const workspace = computed(() => wsStore.workspaces.find((ws) => ws.id === workspaceId))
const showManageMember = ref(false)
</script>

<template>
  <section id="task-view">
    <div class="workspace-header">
      <h2>{{ workspace?.title }}</h2>
      <p class="workspace-description">{{ workspace?.description }}</p>
      <el-button class="add-member-btn" @click="showManageMember = true">Manage members</el-button>
    </div>

    <TaskCards />

    <ManageMemberDrawer v-model:visible="showManageMember" :workspace-id="workspaceId" />
  </section>
</template>

<style scoped>
.workspace-header {
  margin: 4rem;
  text-align: center;
  position: relative;
}

.workspace-header h2 {
  color: #000;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  border-bottom: 3px solid #000;
  display: inline-block;
  padding-bottom: 0.5rem;
}

.add-member-btn {
  position: absolute;
  top: 0;
  right: 0;
  background-color: transparent;
  border: 2px solid #000;
  color: #000;
  font-weight: 600;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

:deep(.add-member-btn:hover) {
  background-color: #000;
  color: white;
  transform: translateY(-1px);
}
</style>
