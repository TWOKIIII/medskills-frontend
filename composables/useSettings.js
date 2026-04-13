// composables/useSettings.js
import { ref } from 'vue'

// Глобальное реактивное состояние
const settings = ref({
  notifications: true,
  locale: 'ru'
})

// Флаг инициализации
let initialized = false

export const useSettings = () => {
  const loadSettings = () => {
    if (process.client && !initialized) {
      const saved = localStorage.getItem('medskills_settings')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          settings.value = { ...settings.value, ...parsed }
        } catch (e) {
          console.error('Error loading settings')
        }
      }
      initialized = true
    }
  }
  
  const saveSettings = () => {
    if (process.client) {
      localStorage.setItem('medskills_settings', JSON.stringify(settings.value))
    }
  }
  
  const toggleNotifications = () => {
    settings.value.notifications = !settings.value.notifications
    saveSettings()
    return settings.value.notifications
  }
  
  const setLocale = (locale) => {
    settings.value.locale = locale
    saveSettings()
    if (process.client) {
      localStorage.setItem('locale', locale)
    }
  }
  
  // Автозагрузка при первом обращении
  loadSettings()
  
  return {
    settings,
    loadSettings,
    toggleNotifications,
    setLocale
  }
}