<script lang="ts" setup>
import { useWorkSpaceStore } from '@/stores/workspaceStore'
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { Workspace } from '@/types/Workspace'
import AddMemberDialog from '@/components/AddMemberDialog.vue'
import { useUserStore } from '@/stores/userStore'
import WorkSpaceForm from '@/components/WorkSpaceForm.vue'

const workspaceStore = useWorkSpaceStore()
const showFormDialog = ref(false)
const showMemberDialog = ref(false)
const selectedWorkspaceId = ref<number | null>(null)
const userStore = useUserStore()

const deleteWorkspace = async (workspace: Workspace, event: Event) => {
  event.preventDefault()
  event.stopPropagation()

  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete "${workspace.title}"?`,
      'Delete Workspace',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning',
        confirmButtonClass: 'delete-confirm-btn',
        cancelButtonClass: 'delete-cancel-btn',
      },
    )

    workspaceStore.deleteWorkspace(workspace.id!)
  } catch {
    ElMessage.info('Deletion Cancelled')
  }
}
</script>

<template>
  <section id="home">
    <h2>WorkSpaces</h2>

    <div class="container">
      <el-button @click="showFormDialog = true"
        >Add WorkSpace <el-icon><Plus /></el-icon
      ></el-button>
      <div
        v-for="(workspace, index) in workspaceStore.forActiveUser.filter(
          (ws) => ws.ownerEmail === userStore.activeUser?.email,
        )"
        :key="index"
        class="workspace-item"
      >
        <router-link :to="`/task/${workspace.id}`">
          <el-card shadow="hover">
            <h3>{{ workspace.title }}</h3>
          </el-card>
        </router-link>
        <el-tooltip effect="dark" content="Delete workspace" placement="top-start">
          <button class="delete-btn" @click="deleteWorkspace(workspace, $event)">
            <el-icon><Close /></el-icon>
          </button>
        </el-tooltip>
      </div>
    </div>
    <el-divider />

    <h2>Shared Workspaces</h2>
    <div class="container">
      <div
        v-for="(workspace, index) in workspaceStore.forActiveUser.filter(
          (ws) => ws.ownerEmail !== userStore.activeUser?.email,
        )"
        :key="index"
        class="workspace-item"
      >
        <router-link :to="`/task/${workspace.id}`">
          <el-card shadow="hover">
            <h3>{{ workspace.title }}</h3>
          </el-card>
        </router-link>
      </div>
    </div>
  </section>

  <WorkSpaceForm v-model:visible="showFormDialog" />
  <AddMemberDialog v-model:visible="showMemberDialog" :workspace-id="selectedWorkspaceId!" />
</template>

<style scoped>
#home {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

#home h2 {
  color: #000;
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 2rem;
  border-bottom: 2px solid #000;
  padding-bottom: 0.5rem;
}

.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  align-items: start;
}

.workspace-item {
  position: relative;
}

.delete-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: #000;
  color: white;
  border: none;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.3s ease;
  z-index: 10;
}

.members-btn {
  position: absolute;
  top: -8px;
  right: 28px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: #000;
  color: white;
  border: none;
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.3s ease;
  z-index: 10;
}

.workspace-item:hover .delete-btn,
.workspace-item:hover .members-btn {
  opacity: 1;
  transform: scale(1);
}

.delete-btn:hover {
  background-color: #dc2626;
  transform: scale(1.1);
}

.members-btn:hover {
  background-color: #0066cc;
  transform: scale(1.1);
}

:deep(.el-button) {
  background-color: #000;
  border-color: #000;
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  height: 120px;
  width: 100%;
  border: 2px dashed #000;
  background-color: transparent;
  color: #000;
  transition: all 0.3s ease;
}

:deep(.el-button:hover) {
  background-color: #000;
  color: white;
  border-style: solid;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.container > div:not(:first-child) {
  transition: transform 0.2s ease;
}

.container > div:not(:first-child):hover {
  transform: translateY(-2px);
}

a {
  text-decoration: none;
  color: inherit;
}

:deep(.el-card) {
  border: 2px solid #000;
  border-radius: 8px;
  background-color: white;
  transition: all 0.3s ease;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.el-card:hover) {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  border-color: #333;
}

:deep(.el-card__body) {
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

:deep(.el-card h3) {
  color: #000;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
  text-align: center;
  line-height: 1.4;
}

:deep(.delete-confirm-btn) {
  background-color: #dc2626 !important;
  border-color: #dc2626 !important;
}

:deep(.delete-cancel-btn) {
  background-color: #6b7280 !important;
  border-color: #6b7280 !important;
}

@media (max-width: 768px) {
  #home {
    padding: 1rem;
  }

  .container {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  #home h2 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .delete-btn {
    opacity: 1;
  }

  .members-btn {
    opacity: 1;
  }
}
</style>
