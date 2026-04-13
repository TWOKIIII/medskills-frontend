// composables/useLanguage.js
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSettings } from './useSettings'

const languages = [
  { 
    code: 'ru', 
    name: 'Русский', 
    short: 'RU',
    flagClass: 'fi fi-ru'
  },
  { 
    code: 'en', 
    name: 'English', 
    short: 'EN',
    flagClass: 'fi fi-gb'
  }
]

export const useLanguage = () => {
  const { locale } = useI18n()
  const { settings, setLocale: setSettingsLocale } = useSettings()
  
  const setLocale = (code) => {
    locale.value = code
    setSettingsLocale(code) // Синхронизируем с настройками
    
    if (process.client) {
      localStorage.setItem('locale', code)
    }
    
    return code
  }
  
  const loadLocale = () => {
    if (!process.client) return
    
    // Берём язык из settings (уже загружен)
    if (settings.value.locale) {
      locale.value = settings.value.locale
    }
  }
  
  const getLanguageName = (code) => {
    const lang = languages.find(l => l.code === code)
    return lang ? lang.name : code
  }
  
  const currentLocale = computed(() => settings.value.locale)
  
  return {
    currentLocale,
    languages,
    setLocale,
    loadLocale,
    getLanguageName
  }
}