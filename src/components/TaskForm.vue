<script lang="ts" setup>
import { taskRules } from '@/rules/taskRules'
import { useWorkSpaceStore } from '@/stores/workspaceStore'
import type { FormInstance } from 'element-plus'
import { reactive, ref, watch } from 'vue'

const props = defineProps<{
  visible: boolean
  status: 'todo' | 'doing' | 'done'
  workspaceId: number
}>()
const emits = defineEmits(['update:visible'])

const dialogVisible = ref(props.visible)
const store = useWorkSpaceStore()
const form = reactive({
  title: '',
  description: '',
})
const formRef = ref<FormInstance>()

watch(
  () => props.visible,
  (v) => (dialogVisible.value = v),
)
watch(dialogVisible, (v) => emits('update:visible', v))

const onSubmit = async () => {
  try {
    if (!form.title.trim() || !form.description.trim()) return

    store.addTask(props.workspaceId, {
      title: form.title,
      description: form.description,
      status: props.status,
    })

    form.title = ''
    form.description = ''

    dialogVisible.value = false
    emits('update:visible', false)
  } catch (error) {
    console.error('Error in taskform submission: ', error)
  }
}
</script>

<template>
  <el-dialog v-model="dialogVisible" title="Add Task" width="500" destroy-on-close>
    <el-form
      ref="formRef"
      :model="form"
      label-width="auto"
      :rules="taskRules(form)"
      @submit.prevent="onSubmit"
      label-position="top"
    >
      <el-form-item label="Title" prop="title">
        <el-input v-model="form.title" placeholder="Task title" />
      </el-form-item>
      <el-form-item label="Description" prop="description">
        <el-input v-model="form.description" placeholder="Task description" />
      </el-form-item>

      <el-button native-type="submit">Confirm</el-button>
    </el-form>
  </el-dialog>
</template>

<style scoped>
:deep(.el-dialog) {
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  border: 1px solid #e5e5e5;
}

:deep(.el-dialog__header) {
  background: #000000;
  border-radius: 8px 8px 0 0;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e5e5;
}

:deep(.el-dialog__title) {
  color: #ffffff;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.025em;
}

:deep(.el-dialog__headerbtn) {
  top: 20px;
  right: 24px;
  width: 24px;
  height: 24px;
}

:deep(.el-dialog__close) {
  color: #ffffff;
  font-size: 16px;
  transition: color 0.2s ease;
}

:deep(.el-dialog__close:hover) {
  color: #cccccc;
}

:deep(.el-dialog__body) {
  padding: 32px 24px;
  background: #ffffff;
}

:deep(.el-form-item) {
  margin-bottom: 24px;
}

:deep(.el-form-item__label) {
  color: #333333;
  font-weight: 500;
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 8px;
}

:deep(.el-input) {
  height: 44px;
}

:deep(.el-input__wrapper) {
  background: #ffffff;
  border: 1.5px solid #e5e5e5;
  border-radius: 6px;
  padding: 0 16px;
  transition: all 0.2s ease;
}

:deep(.el-input__wrapper:hover) {
  border-color: #333333;
}

:deep(.el-input__wrapper.is-focus) {
  border-color: #000000;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
}

:deep(.el-input__inner) {
  color: #333333;
  font-size: 14px;
  height: 100%;
}

:deep(.el-input__inner::placeholder) {
  color: #999999;
}

:deep(.el-button) {
  background: #000000;
  color: #ffffff;
  border: 1.5px solid #000000;
  border-radius: 6px;
  padding: 12px 32px;
  font-weight: 500;
  font-size: 14px;
  height: auto;
  min-height: 44px;
  transition: all 0.2s ease;
  cursor: pointer;
}

:deep(.el-button:hover) {
  background: #333333;
  border-color: #333333;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

:deep(.el-button:active) {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

:deep(.el-overlay) {
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
}
</style>
