<script lang="ts" setup>
import { useWorkSpaceStore } from '@/stores/workspaceStore'
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  visible: boolean
  workspaceId: number
  taskId: number
}>()
const emits = defineEmits(['update:visible'])
const dialogVisible = ref(props.visible)

const wsStore = useWorkSpaceStore()
const workspace = computed(() => wsStore.workspaces.find((ws) => ws.id === props.workspaceId))
const task = computed(() => workspace.value?.task?.find((t) => t.id === props.taskId))

watch(
  () => props.visible,
  (v) => (dialogVisible.value = v),
)
watch(dialogVisible, (v) => emits('update:visible', v))
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    title=""
    width="520px"
    destroy-on-close
    :show-close="false"
    class="task-detail-dialog"
  >
    <template #header>
      <div class="dialog-header">
        <h2 class="dialog-title">Task Details</h2>

        <el-icon @click="dialogVisible = false" style="cursor: pointer"><Close /></el-icon>
      </div>
    </template>

    <!-- Content -->
    <div class="task-content">
      <div class="task-field">
        <label class="field-label">Title</label>
        <div class="field-value">{{ task?.title || 'No title provided' }}</div>
      </div>

      <div class="task-field">
        <label class="field-label">Description</label>
        <div class="field-value">{{ task?.description || 'No description provided' }}</div>
      </div>

      <div class="task-field">
        <label class="field-label">Status</label>
        <div class="field-value">
          <span class="status-badge" :class="`status-${task?.status?.toLowerCase()}`">
            {{ task?.status || 'Unknown' }}
          </span>
        </div>
      </div>

      <div class="task-field">
        <label class="field-label">Created</label>
        <div class="field-value">{{ task?.createdAt || 'Unknown date' }}</div>
      </div>
    </div>
  </el-dialog>
</template>

<style scoped>
/* Dialog styling */
:deep(.task-detail-dialog) {
  .el-dialog {
    border-radius: 12px;
    background: #ffffff;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    border: 1px solid #e5e7eb;
  }

  .el-dialog__header {
    padding: 0;
    border-bottom: 1px solid #f3f4f6;
  }

  .el-dialog__body {
    padding: 0;
  }
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 28px;
  background: #fafafa;
  border-radius: 12px 12px 0 0;
}

.dialog-title {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.task-content {
  padding: 28px;
  background: #ffffff;
}

.task-field {
  margin-bottom: 20px;
}

.task-field:last-child {
  margin-bottom: 0;
}

.field-label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.field-value {
  font-size: 15px;
  color: #111827;
  line-height: 1.5;
  min-height: 20px;
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  text-transform: capitalize;
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #e5e7eb;
}

.status-done {
  background: green;
  color: #ffffff;
  border-color: #000000;
}

.status-todo {
  background: #ffffff;
  color: #000000;
  border-color: #d1d5db;
}

.status-doing {
  background: #f9fafb;
  color: #111827;
  border-color: #9ca3af;
}
</style>
