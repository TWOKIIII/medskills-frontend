import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSettings } from './useSettings'
import { LANGUAGES } from '~/constants/languages'

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
    
    const { settings } = useSettings()
    if (settings.value.locale) {
      currentLocale.value = settings.value.locale
      locale.value = settings.value.locale
    } else {
      currentLocale.value = 'ru'
      locale.value = 'ru'
      setSettingsLocale('ru')
      localStorage.setItem('locale', 'ru')
    }
  }
  
  const getLanguageName = (code) => {
    const lang = LANGUAGES.find(l => l.code === code)
    return lang ? lang.name : code
  }
  
  const getLanguageChangeMessage = (code, langName) => {
    const messages = {
      ru: `Язык изменён на ${langName}`,
      en: `Language changed to ${langName}`,
      de: `Sprache auf ${langName} geändert`,
      fr: `Langue changée en ${langName}`,
      be: `Мова зменена на ${langName}`,
      kk: `Тіл ${langName} тіліне өзгертілді`,
      pl: `Język zmieniony na ${langName}`,
      sv: `Språk ändrat till ${langName}`
    }
    return messages[code] || messages.en
  }
  
  return {
    currentLocale: computed(() => currentLocale.value),
    languages: LANGUAGES,
    setLocale,
    loadLocale,
    getLanguageName,
    getLanguageChangeMessage
  }
}