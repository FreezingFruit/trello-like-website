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
      <div class="header-content">
        <div class="title-section">
          <h2>{{ workspace?.title }}</h2>
          <p class="workspace-description">{{ workspace?.description }}</p>
        </div>
        <div class="action-section">
          <el-button class="add-member-btn" @click="showManageMember = true">
            <span class="btn-text">Manage members</span>
          </el-button>
        </div>
      </div>
    </div>

    <div class="content-wrapper">
      <TaskCards />
    </div>

    <ManageMemberDrawer v-model:visible="showManageMember" :workspace-id="workspaceId" />
  </section>
</template>

<style scoped>
#task-view {
  min-height: 100vh;
}

.workspace-header {
  border-bottom: 1px solid #e5e5e5;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.title-section {
  text-align: center;
  flex: 1;
}

.workspace-header h2 {
  color: #1a1a1a;
  font-size: 2.75rem;
  font-weight: 800;
  margin-bottom: 1rem;
  position: relative;
  display: inline-block;
  line-height: 1.2;
}

.workspace-header h2::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, #000 0%, #333 100%);
  border-radius: 2px;
}

.workspace-description {
  max-width: 650px;
  color: #666;
  font-size: 1.125rem;
  line-height: 1.6;
  margin: 0 auto;
  font-weight: 400;
}

.action-section {
  display: flex;
  align-items: center;
}

.add-member-btn {
  background: white;
  border: 2px solid #1a1a1a;
  color: #1a1a1a;
  font-weight: 600;
  padding: 0.875rem 2rem;
  border-radius: 12px;
  font-size: 0.95rem;
  letter-spacing: 0.025em;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.add-member-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.6s;
}

.btn-text {
  position: relative;
  z-index: 1;
}

:deep(.add-member-btn:hover) {
  background: #1a1a1a;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-color: #1a1a1a;
}

.add-member-btn:hover::before {
  left: 100%;
}

:deep(.add-member-btn:active) {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.12);
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

@media (min-width: 768px) {
  .header-content {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 3rem;
    padding: 2.5rem 2rem;
  }

  .title-section {
    text-align: left;
    flex: 1;
  }

  .workspace-header h2 {
    font-size: 3rem;
    margin-bottom: 1.25rem;
  }

  .workspace-header h2::after {
    left: 0;
    transform: none;
  }

  .workspace-description {
    margin: 0;
    font-size: 1.2rem;
  }

  .content-wrapper {
    padding: 3rem 2rem;
  }
}

@media (min-width: 1024px) {
  .workspace-header h2 {
    font-size: 3.25rem;
  }

  .add-member-btn {
    padding: 1rem 2.5rem;
    font-size: 1rem;
  }
}
</style>
