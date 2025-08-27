<script lang="ts" setup>
import { watch } from 'vue'
import WorkSpaceForm from './WorkSpaceForm.vue'
import { ref } from 'vue'

const props = defineProps<{ visible: boolean }>()
const emits = defineEmits(['update:visible'])

const dialogVisible = ref(props.visible)

watch(
  () => props.visible,
  (v) => (dialogVisible.value = v),
)
watch(dialogVisible, (v) => emits('update:visible', v))
</script>

<template>
  <el-dialog v-model="dialogVisible" title="Add Workspace" width="500" destroy-on-close>
    <WorkSpaceForm />
  </el-dialog>
</template>
