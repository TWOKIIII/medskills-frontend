<template>
  <nav class="main-nav">
    <ul>
      <li 
        v-for="item in menuItems" 
        :key="item.id"
        :class="{ active: currentPath === item.path }"
        @click="navigateTo(item.path)"
      >
        {{ t(item.labelKey) }}
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const currentPath = ref(route.path)

const menuItems = [
  { id: 'tests', labelKey: 'app.tests', path: '/' },
  { id: 'stats', labelKey: 'app.statistics', path: '/stats' },
  { id: 'knowledge', labelKey: 'app.knowledge', path: '/knowledge' },
  { id: 'settings', labelKey: 'app.settings', path: '/settings' },
  { id: 'help', labelKey: 'app.help', path: '/help' }
]

const navigateTo = (path) => {
  router.push(path)
  currentPath.value = path
}
</script>

<style scoped>
.main-nav {
  margin-bottom: 30px;
  border-bottom: 1px solid #e2e8f0;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.main-nav ul {
  display: flex;
  list-style: none;
  gap: 24px;
  padding-bottom: 12px;
}

.main-nav li {
  font-size: 15px;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  padding-bottom: 12px;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
  white-space: nowrap;
}

.main-nav li:hover {
  color: #475569;
}

.main-nav li.active {
  color: #3b82f6;
  border-bottom: 2px solid #3b82f6;
}

.main-nav::-webkit-scrollbar {
  display: none;
}

.main-nav {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>