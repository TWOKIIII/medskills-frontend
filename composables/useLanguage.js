// composables/useLanguage.js
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSettings } from './useSettings'

const languages = [
  { code: 'ru', name: 'Русский', short: 'RU', flagClass: 'fi fi-ru' },
  { code: 'en', name: 'English', short: 'EN', flagClass: 'fi fi-gb' },
  { code: 'de', name: 'Deutsch', short: 'DE', flagClass: 'fi fi-de' },
  { code: 'fr', name: 'Français', short: 'FR', flagClass: 'fi fi-fr' },
  { code: 'be', name: 'Беларуская', short: 'BY', flagClass: 'fi fi-by' },
  { code: 'kk', name: 'Қазақша', short: 'KZ', flagClass: 'fi fi-kz' },
  { code: 'pl', name: 'Polski', short: 'PL', flagClass: 'fi fi-pl' },
  { code: 'sv', name: 'Svenska', short: 'SE', flagClass: 'fi fi-se' }
]

// Глобальная переменная для хранения текущей локали
const currentLocale = ref('ru')

export const useLanguage = () => {
  const { locale } = useI18n()
  const { settings, setLocale: setSettingsLocale } = useSettings()
  
  const setLocale = (code) => {
    currentLocale.value = code
    locale.value = code
    setSettingsLocale(code)
    if (process.client) {
      localStorage.setItem('locale', code)
    }
    return code
  }
  
  const loadLocale = () => {
    if (!process.client) return
    
    // Загружаем из settings
    const { settings } = useSettings()
    if (settings.value.locale) {
      currentLocale.value = settings.value.locale
      locale.value = settings.value.locale
    } else {
      // Если нет, ставим русский по умолчанию
      currentLocale.value = 'ru'
      locale.value = 'ru'
      setSettingsLocale('ru')
      localStorage.setItem('locale', 'ru')
    }
  }
  
  const getLanguageName = (code) => {
    const lang = languages.find(l => l.code === code)
    return lang ? lang.name : code
  }
  
  return {
    currentLocale: computed(() => currentLocale.value),
    languages,
    setLocale,
    loadLocale,
    getLanguageName
  }
}