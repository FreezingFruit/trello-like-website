<script lang="ts" setup>
import TaskForm from '@/components/TaskForm.vue'
import { useWorkSpaceStore } from '@/stores/workspaceStore'
import type { Task } from '@/types/Task'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import draggable from 'vuedraggable'
import { Edit, Check } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import TaskDetailsDialog from './TaskDetailsDialog.vue'

const route = useRoute()
const wsStore = useWorkSpaceStore()
const showDialog = ref(false)

const workspaceId = Number(route.params.id)
const workspace = computed(() => wsStore.workspaces.find((ws) => ws.id === workspaceId))

const taskDialogVisible = ref(false)
const selectedWorkspaceId = ref<number | null>(null)
const selectedTaskId = ref<number | null>(null)

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
  wsStore.saveWorkSpaces()
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

    wsStore.saveWorkSpaces()
  }
}

const deleteTask = (wsId: number, taskId: number) => {
  wsStore.deleteTask(wsId, taskId)
}

onMounted(() => {
  wsStore.loadWorkSpaces()
})

//functions for inline editing
const inlineEditTask = (task: Task) => {
  task.editing = true
}

const saveTask = (task: Task) => {
  if (!task.title || task.title.trim() === '' || task.title === undefined) {
    ElMessage.error('Title cannot be empty!')
    return
  }

  if (task.description === undefined || task.description.trim() === '') {
    task.description = 'No Description'
    return
  }

  task.editing = false
  wsStore.saveWorkSpaces()
}

const openTaskDetail = (workspaceId: number, taskId: number) => {
  selectedWorkspaceId.value = workspaceId
  selectedTaskId.value = taskId
  taskDialogVisible.value = true
}
</script>

<template>
  <section id="task">
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
            <div class="task-card" @click="openTaskDetail(workspaceId, element.id)">
              <div class="task-content">
                <!--Nonedting content-->
                <template v-if="!element.editing">
                  <h4>{{ element.title }}</h4>

                  <p v-if="element.description" class="task-description">
                    {{ element.description }}
                  </p>
                </template>

                <!--Inline Editing-->
                <template v-else>
                  <el-input
                    title="Name"
                    v-model="element.title"
                    @blur="saveTask(element)"
                    @keyup.enter="saveTask(element)"
                    placeholder="Edit your task"
                    style="margin-bottom: 1rem"
                  />

                  <el-input
                    v-model="element.description"
                    type="textarea"
                    @blur="saveTask(element)"
                    @keyup.enter="saveTask(element)"
                    placeholder="Edit description"
                  />

                  <el-button :icon="Check" class="edit-done-btn" @click.stop="saveTask(element)"
                    >Done</el-button
                  >
                </template>
              </div>
              <el-button
                v-if="!element.editing"
                class="delete-btn"
                @click.stop="deleteTask(workspaceId, element.id)"
              >
                <el-icon><Close /></el-icon>
              </el-button>

              <el-button
                v-if="!element.editing"
                :icon="Edit"
                circle
                size="small"
                @click.stop="inlineEditTask(element)"
                class="edit-btn"
              />
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
            <div class="task-card doing-task" @click.stop="openTaskDetail(workspaceId, element.id)">
              <div class="task-content">
                <!--Not editing display-->
                <template v-if="!element.editing">
                  {{ element.title }}

                  <p v-if="element.description" class="task-description">
                    {{ element.description }}
                  </p>
                </template>

                <!--Inline Editing-->
                <template v-else>
                  <el-input
                    v-model="element.title"
                    @blur="saveTask(element)"
                    @keyup.enter="saveTask(element)"
                    placeholder="Edit title"
                    style="margin-bottom: 1rem"
                  />

                  <el-input
                    v-model="element.description"
                    type="textarea"
                    @blur="saveTask(element)"
                    @keyup.enter="saveTask(element)"
                    placeholder="Edit description"
                  />

                  <el-button :icon="Check" class="edit-done-btn" @click.stop="saveTask(element)"
                    >Done</el-button
                  >
                </template>
              </div>
              <el-button
                v-if="!element.editing"
                class="delete-btn"
                @click.stop="deleteTask(workspaceId, element.id)"
              >
                <el-icon><Close /></el-icon>
              </el-button>

              <el-button
                v-if="!element.editing"
                class="edit-btn"
                circle
                :icon="Edit"
                @click.stop="inlineEditTask(element)"
              />
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
            <div class="task-card done-task" @click="openTaskDetail(workspaceId, element.id)">
              <div class="task-content">
                <template v-if="!element.editing">
                  <h4>{{ element.title }}</h4>

                  <p v-if="element.description" class="task-description">
                    {{ element.description }}
                  </p>
                </template>

                <!--Inline Editing-->
                <template v-else>
                  <el-input
                    v-model="element.title"
                    @blur="saveTask(element)"
                    @keyup.enter="saveTask(element)"
                    placeholder="Edit title"
                    style="margin-bottom: 1rem"
                  />

                  <el-input
                    v-model="element.description"
                    type="textarea"
                    @blur="saveTask(element)"
                    @keyup.enter="saveTask(element)"
                    placeholder="Edit description"
                  />

                  <el-button :icon="Check" class="edit-done-btn" @click.stop="saveTask(element)"
                    >Done</el-button
                  >
                </template>
              </div>
              <el-button class="delete-btn" @click.stop="deleteTask(workspaceId, element.id)">
                <el-icon><Close /></el-icon>
              </el-button>

              <el-button
                v-if="!element.editing"
                class="edit-btn"
                circle
                :icon="Edit"
                @click.stop="inlineEditTask(element)"
              />
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
    <TaskDetailsDialog
      v-model:visible="taskDialogVisible"
      :task-id="selectedTaskId!"
      :workspace-id="selectedWorkspaceId!"
    />
  </section>
</template>

<style scoped>
#task {
  width: 100%;
  max-width: 1440px;
  margin: auto;
  padding: 1rem;
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
  min-height: 400px;
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
  right: 3rem;
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

.edit-btn {
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

.edit-btn:hover {
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

.edit-done-btn {
  background-color: transparent;
  border: 2px solid #000;
  color: #000;
  font-weight: 600;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.edit-done-btn:hover {
  background-color: #000;
  color: white;
  border-style: solid;
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
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  #task {
    padding: 1rem;
  }

  .workspace-header h2 {
    font-size: 2rem;
  }

  .add-member-btn {
    position: static;
    margin-top: 1rem;
  }
}

@media (max-width: 768px) {
  .board-columns {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  .workspace-header h2 {
    font-size: 1.6rem;
  }

  .workspace-description {
    font-size: 0.95rem;
  }
  .task-card {
    padding: 1rem;
  }
}
</style>
