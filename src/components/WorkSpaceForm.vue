<script lang="ts" setup>
import { useWorkSpaceStore } from '@/stores/workspaceStore'
import type { FormInstance } from 'element-plus'
import { reactive, ref } from 'vue'

const formRef = ref<FormInstance>()
const store = useWorkSpaceStore()
const form = reactive({
  title: '',
  description: '',
})

const onSubmit = async () => {
  try {
    if (!formRef.value) return

    store.addWorkSpace(form)

    form.title = ''
    form.description = ''
  } catch (error) {
    console.error('Submit error!: ', error)
  }
}
</script>

<template>
  <el-form ref="formRef" :model="form" label-width="auto" @submit.prevent="onSubmit">
    <el-form-item label="Title">
      <el-input v-model="form.title" placeholder="Enter title" />
    </el-form-item>
    <el-form-item label="Description">
      <el-input v-model="form.description" placeholder="Enter description" />
    </el-form-item>

    <el-button native-type="submit">Confirm</el-button>
  </el-form>
</template>
