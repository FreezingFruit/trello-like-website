<script lang="ts" setup>
import WorkSpaceDialog from '@/components/WorkSpaceDialog.vue'
import { useWorkSpaceStore } from '@/stores/workspaceStore'
import { onMounted, ref } from 'vue'

const workspaceStore = useWorkSpaceStore()
const showDialog = ref(false)

onMounted(() => {
  workspaceStore.loadWorkSpaces()
})
</script>

<template>
  <section id="home">
    <h2>WorkSpaces</h2>

    <div class="container">
      <el-button @click="showDialog = true">Add WorkSpace +</el-button>
      <div v-for="(workspace, index) in workspaceStore.workspaces" :key="index">
        <router-link :to="`/task/${workspace.id}`">
          <el-card shadow="hover">
            <h3>{{ workspace.title }}</h3>
          </el-card>
        </router-link>
      </div>
    </div>
  </section>

  <WorkSpaceDialog v-model:visible="showDialog" />
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
}
</style>
