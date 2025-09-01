<script lang="ts" setup>
import { ref, watch } from 'vue'
import SignInForm from './SignInForm.vue'
import SignUpForm from './SignUpForm.vue'

const props = defineProps<{ visible: boolean; mode: 'signin' | 'signup' }>()
const emits = defineEmits(['update:visible', 'update:mode'])
const dialogVisible = ref(props.visible)

const resetKey = ref(0)

watch(
  () => props.visible,
  (v) => (dialogVisible.value = v),
)
watch(dialogVisible, (v) => emits('update:visible', v))

watch(
  () => props.mode,
  () => {
    resetKey.value++ // force remount form
  },
)
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="props.mode === 'signin' ? 'Welcome Back!' : 'Join Us Today!'"
    width="500"
    destroy-close
    class="auth-dialog"
  >
    <div class="dialog-content">
      <component
        :is="props.mode === 'signin' ? SignInForm : SignUpForm"
        :key="resetKey"
        @success="emits('update:visible', false)"
      />

      <div class="divider"></div>

      <div class="links">
        <span
          v-if="props.mode === 'signin'"
          @click="emits('update:mode', 'signup')"
          class="link-text"
        >
          No account? <strong>Register Now!</strong>
        </span>
        <span v-else @click="emits('update:mode', 'signin')" class="link-text">
          Already have an account? <strong>Sign in now!</strong>
        </span>
      </div>
    </div>
  </el-dialog>
</template>

<style scoped>
.dialog-content {
  padding: 1rem 0;
}

.divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, #e0e0e0, transparent);
  margin: 2rem 0 1.5rem 0;
}

.links {
  text-align: center;
  margin-top: 1rem;
}

.link-text {
  color: #666;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  padding: 0.5rem;
  border-radius: 4px;
  display: inline-block;
}

.link-text:hover {
  color: #000;
  background-color: #f8f9fa;
  transform: translateY(-1px);
}

.link-text strong {
  color: #000;
  font-weight: 600;
}

:deep(.el-dialog) {
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  border: none;
  overflow: hidden;
}

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
