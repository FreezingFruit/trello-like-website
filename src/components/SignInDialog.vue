<script lang="ts" setup>
import { userFormRules } from '@/rules/userRules'
import { useUserStore } from '@/stores/userStore'
import { ElMessage, type FormInstance } from 'element-plus'
import { reactive, ref, watch } from 'vue'

const props = defineProps<{ visible: boolean }>()
const emits = defineEmits(['update:visible'])
const dialogVisible = ref(props.visible)

const userStore = useUserStore()

const formRef = ref<FormInstance>()
const form = reactive({
  email: '',
  password: '',
})

watch(
  () => props.visible,
  (v) => (dialogVisible.value = v),
)
watch(dialogVisible, (v) => emits('update:visible', v))

const onSubmit = async () => {
  try {
    if (!formRef.value) return
    await formRef.value.validate()

    userStore.loginUser(form.email, form.password)
    ElMessage.success('Successfully logged in!')
    dialogVisible.value = false
  } catch (error) {
    console.error('User signin error: ', error)
  }
}
</script>

<template>
  <el-dialog v-model="dialogVisible" title="Tips" width="500" destroy-on-close>
    <el-form
      ref="formRef"
      :model="form"
      label-width="auto"
      :rules="userFormRules(form)"
      @submit.prevent="onSubmit"
    >
      <el-form-item label="Email" prop="email">
        <el-input v-model="form.email" placeholder="Enter email" />
      </el-form-item>

      <el-form-item label="Password" prop="password">
        <el-input v-model="form.password" placeholder="Enter password" />
      </el-form-item>

      <el-button native-type="submit">Login</el-button>
    </el-form>
  </el-dialog>
</template>
