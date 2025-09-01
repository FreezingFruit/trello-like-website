<script lang="ts" setup>
import { userFormRules } from '@/rules/userRules'
import { useUserStore } from '@/stores/userStore'
import { ElMessage, type FormInstance } from 'element-plus'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()
const formRef = ref<FormInstance>()
const form = reactive({
  email: '',
  password: '',
  confirmPassword: '',
})

const emits = defineEmits(['success'])

const onSubmit = async () => {
  try {
    if (!formRef.value) return
    await formRef.value.validate()

    const duplicateEmailCheck = userStore.users.find(
      (u) => u.email?.trim().toLowerCase() === form.email.trim().toLowerCase(),
    )

    if (duplicateEmailCheck) {
      ElMessage.warning('Email already registered!')
      return
    }

    userStore.registerUser(form.email, form.password)
    emits('success')
    router.push({ name: 'home' })
    ElMessage.success('Registration Successful!')
  } catch (error) {
    console.error('User signup error: ', error)
  }
}
</script>

<template>
  <div class="form-container">
    <el-form
      ref="formRef"
      :model="form"
      label-width="auto"
      :rules="userFormRules(form)"
      label-position="top"
      @submit.prevent="onSubmit"
      class="signup-form"
    >
      <el-form-item label="Email" prop="email">
        <el-input
          v-model="form.email"
          type="email"
          placeholder="Enter your email"
          clearable
          size="large"
        />
      </el-form-item>

      <el-form-item label="Password" prop="password">
        <el-input
          v-model="form.password"
          type="password"
          placeholder="Create a password"
          clearable
          show-password
          size="large"
        />
      </el-form-item>

      <el-form-item label="Confirm Password" prop="confirmPassword">
        <el-input
          v-model="form.confirmPassword"
          type="password"
          placeholder="Confirm your password"
          clearable
          show-password
          size="large"
        />
      </el-form-item>

      <el-button native-type="submit" type="primary" size="large" class="submit-button">
        Register
      </el-button>
    </el-form>
  </div>
</template>

<style scoped>
.form-container {
  max-width: 400px;
  margin: 0 auto;
}

.signup-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Form labels */
:deep(.el-form-item__label) {
  color: #333;
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
}

/* Form items spacing */
:deep(.el-form-item) {
  margin-bottom: 1.5rem;
}

/* Input styling */
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

/* Password visibility icon */
:deep(.el-input__suffix-inner .el-icon) {
  color: #666;
}

:deep(.el-input__suffix-inner .el-icon:hover) {
  color: #000;
}

/* Clear button */
:deep(.el-input__clear) {
  color: #999;
}

:deep(.el-input__clear:hover) {
  color: #666;
}

/* Submit button */
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

/* Error states */
:deep(.el-form-item.is-error .el-input__wrapper) {
  border-color: #f56565;
  background-color: #fef5f5;
}

:deep(.el-form-item__error) {
  color: #f56565;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .form-container {
    max-width: 100%;
  }

  :deep(.el-input__wrapper) {
    padding: 0.625rem 0.875rem;
  }
}
</style>
