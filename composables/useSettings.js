import { ref } from 'vue'

const defaultSettings = {
  notifications: true,
  locale: 'ru',
  theme: 'light'
}

const settings = ref({ ...defaultSettings })
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
          settings.value = { ...defaultSettings }
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
    if (!locale || locale.trim().length === 0) {
      return false
    }
    settings.value.locale = locale
    saveSettings()
    if (process.client) {
      localStorage.setItem('locale', locale)
    }
    return true
  }
  
  const setTheme = (theme) => {
    if (theme !== 'light' && theme !== 'dark') {
      return false
    }
    settings.value.theme = theme
    saveSettings()
    return true
  }

  const resetSettings = () => {
    settings.value = { ...defaultSettings }
    saveSettings()
  }
  
  loadSettings()
  
  return {
    settings,
    loadSettings,
    toggleNotifications,
    setLocale,
    setTheme,
    resetSettings
  }
}