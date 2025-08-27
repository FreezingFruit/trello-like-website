<script lang="ts" setup>
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
    console.log(props.workspaceId)
    store.addTask(props.workspaceId, {
      title: form.title,
      description: form.description,
      status: props.status,
    })
  } catch (error) {
    console.error('Error in taskform submission: ', error)
  }
}
</script>

<template>
  <el-dialog v-model="dialogVisible" title="Tips" width="500" destroy-on-close>
    <el-form ref="formRef" :model="form" label-width="auto" @submit.prevent="onSubmit">
      <el-form-item label="Title">
        <el-input v-model="form.title" placeholder="Task title" />
      </el-form-item>
      <el-form-item label="Description">
        <el-input v-model="form.description" placeholder="Task description" />
      </el-form-item>

      <el-button native-type="submit">Submit</el-button>
    </el-form>
  </el-dialog>
</template>
