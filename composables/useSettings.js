// composables/useSettings.js
import { ref } from 'vue'

const settings = ref({
  notifications: true,
  locale: 'ru',
  theme: 'light'
})

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
      } else {
        localStorage.setItem('medskills_settings', JSON.stringify(settings.value))
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
  
  const setTheme = (theme) => {
    settings.value.theme = theme
    saveSettings()
  }
  
  loadSettings()
  
  return {
    settings,
    loadSettings,
    toggleNotifications,
    setLocale,
    setTheme
  }
}