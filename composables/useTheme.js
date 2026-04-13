// composables/useTheme.js
import { ref } from 'vue'
import { useSettings } from './useSettings'

const isDark = ref(false)

export const useTheme = () => {
  const { settings, setTheme: setSettingsTheme } = useSettings()
  
  const applyTheme = () => {
    if (process.client) {
      const html = document.documentElement
      if (isDark.value) {
        html.classList.add('dark')
      } else {
        html.classList.remove('dark')
      }
      
      // Принудительно обновляем фон body
      document.body.style.backgroundColor = isDark.value ? '#0f172a' : '#f0f4f8'
    }
  }
  
  const initTheme = () => {
    if (process.client) {
      // Берём тему из настроек
      if (settings.value.theme) {
        isDark.value = settings.value.theme === 'dark'
      } else {
        // Или из системных настроек
        isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
        setSettingsTheme(isDark.value ? 'dark' : 'light')
      }
      applyTheme()
    }
  }
  
  const toggleTheme = () => {
    isDark.value = !isDark.value
    const theme = isDark.value ? 'dark' : 'light'
    
    setSettingsTheme(theme)
    
    if (process.client) {
      localStorage.setItem('medskills_theme', theme)
      applyTheme()
    }
    return isDark.value
  }
  
  const setTheme = (dark) => {
    isDark.value = dark
    const theme = dark ? 'dark' : 'light'
    
    setSettingsTheme(theme)
    
    if (process.client) {
      localStorage.setItem('medskills_theme', theme)
      applyTheme()
    }
  }
  
  return {
    isDark,
    initTheme,
    toggleTheme,
    setTheme,
    applyTheme
  }
}