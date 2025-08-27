<script lang="ts" setup>
import TaskForm from '@/components/TaskForm.vue'
import { useWorkSpaceStore } from '@/stores/workspaceStore'
import type { Task } from '@/types/Task'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import draggable from 'vuedraggable'

const route = useRoute()
const store = useWorkSpaceStore()
const showDialog = ref(false)

const workspaceId = Number(route.params.id)
const workspace = computed(() => store.workspaces.find((ws) => ws.id === workspaceId))

const todoTasks = computed({
  get: () => workspace.value?.task?.filter((t) => t.status === 'todo') ?? [],
  set: (newTasks: Task[]) => {
    updateTasksForStatus('todo', newTasks)
  },
})
const doingTasks = computed({
  get: () => workspace.value?.task?.filter((t) => t.status === 'doing') ?? [],
  set: (newTasks: Task[]) => {
    updateTasksForStatus('doing', newTasks)
  },
})
const doneTasks = computed({
  get: () => workspace.value?.task?.filter((t) => t.status === 'done') ?? [],
  set: (newTasks: Task[]) => {
    updateTasksForStatus('done', newTasks)
  },
})

const updateTasksForStatus = (status: 'todo' | 'doing' | 'done', newTasks: Task[]) => {
  if (!workspace.value?.task) return

  const otherTasks = workspace.value.task.filter((t) => t.status !== status)

  const updatedTasks = newTasks.map((t) => ({ ...t, status }))

  workspace.value.task = [...otherTasks, ...updatedTasks]
  store.saveWorkSpaces()
}

const activeStatus = ref<'todo' | 'doing' | 'done'>('todo')

const openForm = (status: 'todo' | 'doing' | 'done') => {
  activeStatus.value = status
  showDialog.value = true
}

const onTaskMoved = (status: 'todo' | 'doing' | 'done') => {
  return (event: any) => {
    if (!workspace.value?.task) return

    if (event.added) {
      const addedTask = event.added.element
      addedTask.status = status
    }

    if (event.moved) {
      console.log('Task moved successfully')
    }

    store.saveWorkSpaces()
  }
}

const deleteTask = (wsId: number, taskId: number) => {
  store.deleteTask(wsId, taskId)
}

onMounted(() => {
  store.loadWorkSpaces()
})
</script>

<template>
  <section id="task">
    <div class="workspace-header">
      <h2>{{ workspace?.title }}</h2>
      <p class="workspace-description">{{ workspace?.description }}</p>
    </div>

    <div class="board-columns">
      <!-- TODO COLUMN -->
      <el-card class="board">
        <template #header>
          <div class="column-header">
            <span class="column-title">To Do</span>
            <span class="task-count">{{ todoTasks.length }}</span>
          </div>
        </template>
        <draggable
          v-model="todoTasks"
          group="tasks"
          item-key="id"
          class="drag-area"
          ghost-class="ghost"
          @change="onTaskMoved('todo')"
        >
          <template #item="{ element }">
            <div class="task-card">
              <div class="task-content">
                <h4>{{ element.title }}</h4>
                <p v-if="element.description" class="task-description">
                  {{ element.description }}
                </p>
              </div>
              <el-button class="delete-btn" @click="deleteTask(workspaceId, element.id)">
                <el-icon><Close /></el-icon>
              </el-button>
            </div>
          </template>

          <template #footer>
            <div v-if="!todoTasks.length" class="empty-state">No tasks yet</div>
          </template>
        </draggable>
        <el-button @click="openForm('todo')" class="add-task-btn"> + Add Task </el-button>
      </el-card>

      <!-- DOING COLUMN -->
      <el-card class="board">
        <template #header>
          <div class="column-header">
            <span class="column-title">Doing</span>
            <span class="task-count">{{ doingTasks.length }}</span>
          </div>
        </template>

        <draggable
          v-model="doingTasks"
          group="tasks"
          item-key="id"
          class="drag-area"
          ghost-class="ghost"
          @change="onTaskMoved('doing')"
        >
          <template #item="{ element }">
            <div class="task-card doing-task">
              <div class="task-content">
                <h4>{{ element.title }}</h4>
                <p v-if="element.description" class="task-description">
                  {{ element.description }}
                </p>
              </div>
              <el-button class="delete-btn" @click="deleteTask(workspaceId, element.id)">
                <el-icon><Close /></el-icon>
              </el-button>
            </div>
          </template>

          <template #footer>
            <div v-if="!doingTasks.length" class="empty-state">No tasks in progress</div>
          </template>
        </draggable>
        <el-button @click="openForm('doing')" class="add-task-btn"> + Add Task </el-button>
      </el-card>

      <!-- DONE COLUMN -->
      <el-card class="board">
        <template #header>
          <div class="column-header">
            <span class="column-title">Done</span>
            <span class="task-count">{{ doneTasks.length }}</span>
          </div>
        </template>
        <draggable
          v-model="doneTasks"
          group="tasks"
          item-key="id"
          class="drag-area"
          ghost-class="ghost"
          @change="onTaskMoved('done')"
        >
          <template #item="{ element }">
            <div class="task-card done-task">
              <div class="task-content">
                <h4>{{ element.title }}</h4>
                <p v-if="element.description" class="task-description">
                  {{ element.description }}
                </p>
              </div>
              <el-button class="delete-btn" @click="deleteTask(workspaceId, element.id)">
                <el-icon><Close /></el-icon>
              </el-button>
            </div>
          </template>

          <template #footer>
            <div v-if="!doneTasks.length" class="empty-state">No completed tasks</div>
          </template>
        </draggable>
        <el-button @click="openForm('done')" class="add-task-btn"> + Add Task </el-button>
      </el-card>
    </div>

    <TaskForm v-model:visible="showDialog" :status="activeStatus" :workspace-id="workspaceId" />
  </section>
</template>

<style scoped>
#task {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  min-height: 100vh;
}

.workspace-header {
  margin-bottom: 2rem;
  text-align: center;
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

.workspace-description {
  color: #333;
  font-size: 1.1rem;
  margin: 1rem 0 0 0;
  font-weight: 500;
}

.board-columns {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  align-items: start;
}

:deep(.el-card.board) {
  border: 2px solid #000;
  border-radius: 12px;
  background-color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  min-height: 500px;
}

:deep(.el-card.board:hover) {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

:deep(.el-card__header) {
  background-color: #f8f8f8;
  border-bottom: 2px solid #000;
  padding: 1rem 1.5rem;
}

:deep(.el-card__body) {
  padding: 1.5rem;
}

.column-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.column-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #000;
}

.task-count {
  background-color: #000;
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  min-width: 2rem;
  text-align: center;
}

.drag-area {
  min-height: 300px;
  padding: 0.5rem 0;
}

.task-card {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.2rem;
  margin-bottom: 1rem;
  cursor: move;
  transition: all 0.3s ease;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.task-card:hover {
  border-color: #000;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.doing-task {
  border-left: 4px solid #333;
}

.done-task {
  opacity: 0.7;
  border-left: 4px solid #000;
}

.done-task .task-content h4 {
  text-decoration: line-through;
  color: #666;
}

.task-content {
  padding-right: 2.5rem;
}

.task-content h4 {
  color: #000;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
}

.task-description {
  margin: 0;
  color: #555;
  font-size: 0.9rem;
  line-height: 1.5;
}

.delete-btn {
  position: absolute;
  top: 0.8rem;
  right: 0.8rem;
  background: transparent;
  border: none;
  color: #999;
  cursor: pointer;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
  font-size: 1rem;
}

.delete-btn:hover {
  background-color: #000;
  color: white;
  transform: scale(1.1);
}

.add-task-btn {
  width: 100%;
  margin-top: 1rem;
  background-color: transparent;
  border: 2px dashed #000;
  color: #000;
  padding: 0.8rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

:deep(.add-task-btn:hover) {
  background-color: #000;
  color: white;
  border-style: solid;
}

.empty-state {
  text-align: center;
  color: #999;
  font-style: italic;
  padding: 2rem 1rem;
  border: 2px dashed #ddd;
  border-radius: 8px;
  margin: 1rem 0;
}

.ghost {
  opacity: 0.6;
  background: #f0f0f0;
  border: 2px dashed #000;
  transform: rotate(2deg);
}

@media (max-width: 1024px) {
  .board-columns {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  #task {
    padding: 1rem;
  }

  .workspace-header h2 {
    font-size: 2rem;
  }
}

@media (max-width: 768px) {
  .workspace-header h2 {
    font-size: 1.8rem;
  }

  .workspace-description {
    font-size: 1rem;
  }

  .task-card {
    padding: 1rem;
  }
}
</style>
