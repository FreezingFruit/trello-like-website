<script lang="ts" setup>
import { useUserStore } from '@/stores/userStore'
import { useWorkSpaceStore } from '@/stores/workspaceStore'
import { ElMessage, type FormInstance } from 'element-plus'
import { reactive, ref, watch } from 'vue'

const props = defineProps<{ visible: boolean; workspaceId: number }>()
const emits = defineEmits(['update:visible'])
const dialogVisible = ref(props.visible)
const formRef = ref<FormInstance>()
const wsStore = useWorkSpaceStore()
const userStore = useUserStore()

const form = reactive({
  email: '',
})

watch(
  () => props.visible,
  (v) => (dialogVisible.value = v),
)
watch(dialogVisible, (v) => emits('update:visible', v))

const onSubmit = async () => {
  try {
    if (!formRef.value) return
    const user = userStore.users.find((u) => u.email === form.email)

    if (!user) {
      ElMessage.error('User with this email does not exist')
      return
    }

    wsStore.addUserAccess(props.workspaceId, form.email)
    dialogVisible.value = false
  } catch (error) {
    console.error('Error in adding member submission: ', error)
  }
}

console.log(props.workspaceId)
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    title="Add Member"
    width="500"
    destroy-on-close
    class="member-dialog"
  >
    <div class="dialog-content">
      <el-form
        ref="formRef"
        :model="form"
        label-width="auto"
        label-position="top"
        @submit.prevent="onSubmit"
        class="member-form"
      >
        <el-form-item label="Email">
          <el-input
            v-model="form.email"
            placeholder="Enter member's email"
            clearable
            size="large"
            type="email"
          />
        </el-form-item>
        <el-button native-type="submit" type="primary" size="large" class="submit-button">
          Add Member
        </el-button>
      </el-form>
    </div>
  </el-dialog>
</template>

<style scoped>
.dialog-content {
  padding: 1rem 0;
}

.member-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

:deep(.el-form-item__label) {
  color: #333;
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
}

:deep(.el-form-item) {
  margin-bottom: 1.5rem;
}

:deep(.el-input__wrapper) {
  background-color: #f8f9fa;
  border: 2px solid transparent;
  border-radius: 8px;
  box-shadow: none;
  transition: all 0.3s ease;
  padding: 0.75rem 1rem;
}

:deep(.el-input__wrapper:hover) {
  background-color: #f0f1f3;
  border-color: #e0e0e0;
}

:deep(.el-input__wrapper.is-focus) {
  background-color: white;
  border-color: #000;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
}

:deep(.el-input__inner) {
  background-color: transparent;
  border: none;
  color: #333;
  font-size: 1rem;
}

:deep(.el-input__inner::placeholder) {
  color: #999;
}

:deep(.el-input__clear) {
  color: #999;
}

:deep(.el-input__clear:hover) {
  color: #666;
}

.submit-button {
  width: 100%;
  margin-top: 1rem;
}

:deep(.el-button--primary) {
  background-color: #000;
  border-color: #000;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  padding: 0.875rem 2rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

:deep(.el-button--primary:hover) {
  background-color: #333;
  border-color: #333;
  transform: translateY(-1px);
}

:deep(.el-button--primary:active) {
  background-color: #000;
  border-color: #000;
  transform: translateY(0);
}

:deep(.el-dialog) {
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  border: none;
  overflow: hidden;
}

:deep(.el-dialog__header) {
  background: linear-gradient(135deg, #000 0%, #333 100%);
  color: white;
  padding: 1.5rem 2rem 1rem 2rem;
  margin: 0;
  border-bottom: none;
}

:deep(.el-dialog__title) {
  color: white;
  font-weight: 600;
  font-size: 1.25rem;
  letter-spacing: 0.5px;
}

:deep(.el-dialog__headerbtn) {
  top: 1.5rem;
  right: 1.5rem;
  width: 32px;
  height: 32px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  transition: all 0.3s ease;
}

:deep(.el-dialog__headerbtn:hover) {
  background-color: rgba(255, 255, 255, 0.2);
}

:deep(.el-dialog__close) {
  color: white;
  font-size: 18px;
  font-weight: bold;
}

:deep(.el-dialog__body) {
  padding: 2rem;
  background-color: white;
}

:deep(.el-overlay) {
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  :deep(.el-dialog) {
    width: 90% !important;
    margin: 5vh auto;
  }

  :deep(.el-dialog__header) {
    padding: 1rem 1.5rem;
  }

  :deep(.el-dialog__body) {
    padding: 1.5rem;
  }
}
</style>
