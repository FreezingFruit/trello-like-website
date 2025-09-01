<script lang="ts" setup>
import { useWorkSpaceStore } from '@/stores/workspaceStore'
import { computed, ref } from 'vue'
import AddMemberDialog from './AddMemberDialog.vue'

const props = defineProps<{ visible: boolean; workspaceId: number }>()
const emit = defineEmits<{ (e: 'update:visible', value: boolean): void }>()

const wsStore = useWorkSpaceStore()
const workspace = computed(() => wsStore.workspaces.find((ws) => ws.id === props.workspaceId))

const showDialog = ref(false)
</script>

<template>
  <el-drawer
    :model-value="props.visible"
    @update:modelValue="(val: boolean) => emit('update:visible', val)"
    size="25%"
    direction="rtl"
    title="Members"
    class="members-drawer"
  >
    <div class="drawer-content">
      <el-button class="add-member-drawer-btn" @click="showDialog = true"
        ><el-icon><Plus /></el-icon> Add Member
      </el-button>
      <!-- Owner Card -->
      <el-card class="member-card owner-card">
        <div class="member-info">
          <div class="member-details">
            <span class="member-email">{{ workspace?.ownerEmail }}</span>
            <span class="member-role">Workspace Owner</span>
          </div>
          <el-tag type="success" class="role-tag">Owner</el-tag>
        </div>
      </el-card>

      <el-divider />
      <!-- Members Cards -->
      <el-card
        v-for="(member, index) in workspace?.userWithAccess"
        :key="index"
        class="member-card"
      >
        <div class="member-info">
          <div class="member-header">
            <div class="member-details">
              <span class="member-email">{{ member.email }}</span>
              <span class="member-role">Team Member</span>
            </div>
            <el-button
              type="danger"
              size="small"
              @click="wsStore.removeUserAccess(workspace?.id!, member.email!)"
              class="remove-btn"
              ><el-icon><DeleteFilled /></el-icon
            ></el-button>
          </div>
          <el-tag type="info" class="role-tag">Member</el-tag>
        </div>
      </el-card>
    </div>
  </el-drawer>

  <AddMemberDialog v-model:visible="showDialog" :workspace-id="props.workspaceId" />
</template>

<style scoped>
.drawer-content {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.add-member-drawer-btn {
  width: 100%;
  background-color: transparent;
  border: 2px dashed #000;
  color: #000;
  font-weight: 600;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  margin-bottom: 0.5rem;
}

.add-member-drawer-btn:hover {
  background-color: #000;
  color: white;
  border-style: solid;
  transform: translateY(-1px);
}

.member-card {
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.member-card:hover {
  border-color: #000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.owner-card {
  border-color: #000;
  background-color: #fafafa;
}

.owner-card:hover {
  border-color: #333;
  background-color: #f5f5f5;
}

.member-card :deep(.el-card__body) {
  padding: 1.2rem;
}

.member-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  gap: 1rem;
}

.member-info {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.member-details {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  flex: 1;
  min-width: 0;
}

.member-email {
  color: #000;
  font-weight: 600;
  font-size: 1rem;
  line-height: 1.3;
  word-break: break-word;
}

.member-role {
  color: #666;
  font-size: 0.85rem;
  font-weight: 500;
}

.role-tag {
  font-weight: 600;
  border-radius: 6px;
  font-size: 0.8rem;
  align-self: flex-start;
}

.remove-btn {
  flex-shrink: 0;
  white-space: nowrap;
}

:deep(.el-drawer) {
  border-left: 3px solid #000;
}

:deep(.el-drawer__header) {
  background: linear-gradient(135deg, #000 0%, #333 100%);
  color: white;
  padding: 1.5rem 2rem;
  margin: 0;
  border-bottom: none;
}

:deep(.el-drawer__title) {
  color: white;
  font-weight: 700;
  font-size: 1.3rem;
  letter-spacing: 0.5px;
}

:deep(.el-drawer__close-btn) {
  color: white;
  font-size: 20px;
  width: 32px;
  height: 32px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  transition: all 0.3s ease;
}

:deep(.el-drawer__close-btn:hover) {
  background-color: rgba(255, 255, 255, 0.2);
}

:deep(.el-drawer__body) {
  padding: 0;
  background-color: #fafafa;
}

:deep(.el-tag--success) {
  background-color: #000;
  border-color: #000;
  color: white;
}

:deep(.el-tag--info) {
  background-color: #666;
  border-color: #666;
  color: white;
}

@media (max-width: 768px) {
  :deep(.el-drawer) {
    width: 80% !important;
  }

  .drawer-content {
    padding: 0.8rem;
  }

  .member-header {
    flex-direction: column;
    align-items: stretch;
    gap: 0.8rem;
  }

  .remove-btn {
    align-self: flex-end;
  }

  .role-tag {
    align-self: flex-start;
  }

  .add-member-drawer-btn {
    padding: 0.8rem;
    font-size: 0.9rem;
  }

  .member-email {
    font-size: 0.9rem;
  }

  .member-role {
    font-size: 0.8rem;
  }
}
</style>
