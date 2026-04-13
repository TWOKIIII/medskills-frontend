// plugins/i18n.js
import { createI18n } from 'vue-i18n'
import ru from '~/locales/ru.json'
import en from '~/locales/en.json'
import de from '~/locales/de.json'
import fr from '~/locales/fr.json'
import be from '~/locales/be.json'
import kk from '~/locales/kk.json'
import pl from '~/locales/pl.json'
import sv from '~/locales/sv.json'

export default defineNuxtPlugin((nuxtApp) => {
  // Получаем сохранённый язык или используем русский
  let savedLocale = 'ru'
  if (process.client) {
    savedLocale = localStorage.getItem('locale') || 'ru'
  }
  
  const i18n = createI18n({
    legacy: false,
    locale: savedLocale,
    fallbackLocale: 'ru',
    messages: {
      ru,
      en,
      de,
      fr,
      be,
      kk,
      pl,
      sv
    }
  })
  
  nuxtApp.vueApp.use(i18n)
  
  return {
    provide: {
      i18n
    }
  }
})