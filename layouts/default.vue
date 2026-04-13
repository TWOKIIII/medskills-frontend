<template>
  <div class="app-layout">
    <slot />
    
    <!-- Снекбар для уведомлений -->
    <div v-if="snackbar.show" class="snackbar" :class="snackbar.color">
      {{ snackbar.message }}
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useNotifications } from '~/composables/useNotifications'
import { useLanguage } from '~/composables/useLanguage'
import { useTheme } from '~/composables/useTheme'

const { snackbar } = useNotifications()
const { loadLocale } = useLanguage()
const { initTheme } = useTheme()

onMounted(() => {
  loadLocale()
  initTheme()
})
</script>

<style scoped>
.app-layout {
  width: 100%;
  min-height: 100vh;
  background: var(--bg-primary, #f0f4f8);
  position: relative;
  color: var(--text-primary, #1e293b);
}

.snackbar {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 2000;
  animation: slideUp 0.3s ease;
}

.snackbar.info {
  background: #3b82f6;
}

.snackbar.success {
  background: #10b981;
}

.snackbar.warning {
  background: #f59e0b;
}

.snackbar.error {
  background: #ef4444;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}
</style>