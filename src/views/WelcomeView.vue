<script lang="ts" setup>
import AuthDialog from '@/components/AuthDialog.vue'
import { useUiStore } from '@/stores/uiStore'

const uiStore = useUiStore()

const learnMore = () => {
  window.open('https://www.youtube.com/watch?v=xvFZjo5PgG0&list=RDxvFZjo5PgG0&start_radio=1')
}
</script>

<template>
  <div class="welcome-container">
    <div class="content">
      <h1 class="welcome-title">Welcome to</h1>
      <h2 class="app-name">TRELLO CLONE</h2>
      <p class="subtitle">Organize your work and life, finally.</p>

      <div class="cta-section">
        <el-button
          class="cta-button"
          type="primary"
          size="large"
          @click="uiStore.openDialog('signin')"
        >
          Get Started
        </el-button>
        <el-button class="cta-button" size="large" @click="learnMore"> Learn More </el-button>
      </div>
    </div>

    <AuthDialog
      v-model:visible="uiStore.showAuthDialog"
      v-model:mode="uiStore.authMode"
      @close="uiStore.closeDialog"
    />
  </div>
</template>

<style scoped>
.welcome-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.content {
  text-align: center;
  max-width: 600px;
  padding: 2rem;
  z-index: 2;
  position: relative;
}

.welcome-title {
  font-size: 3rem;
  font-weight: 300;
  color: #666;
  margin: 0 0 0.5rem 0;
  letter-spacing: 1px;
}

.app-name {
  font-size: 6rem;
  font-weight: 900;
  color: #000;
  margin: 0 0 1rem 0;
  letter-spacing: 2px;
  line-height: 1.1;
}

.subtitle {
  font-size: 1.5rem;
  color: #666;
  margin: 0 0 3rem 0;
  font-weight: 400;
  line-height: 1.4;
}

.cta-section {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}
:deep(.el-button--primary) {
  background-color: #000;
  border-color: #000;
  color: white;
  font-weight: 600;
  padding: 1rem 2rem;
  border-radius: 8px;
}

:deep(.el-button--primary:hover) {
  background-color: #333;
  border-color: #333;
}

:deep(.el-button:not(.el-button--primary)) {
  background-color: transparent;
  border: 2px solid #000;
  color: #000;
  font-weight: 600;
  padding: 1rem 2rem;
  border-radius: 8px;
}

:deep(.el-button:not(.el-button--primary):hover) {
  background-color: #000;
  color: white;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

@media (max-width: 768px) {
  .welcome-title {
    font-size: 1.5rem;
  }

  .app-name {
    font-size: 2.5rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .cta-section {
    flex-direction: column;
    align-items: center;
  }

  .decorative-grid {
    display: none;
  }
}
</style>
