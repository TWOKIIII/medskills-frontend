<template>
  <div class="settings-page">
    <div class="container">
      <AppHeader />
      <AppNavigation />
      
      <div class="section-header">
        <h2>{{ t('settings.title') }}</h2>
      </div>
      
      <div class="settings-card">
        <div class="setting-item">
          <div class="setting-info">
            <h3>{{ t('settings.notifications') }}</h3>
            <p>{{ t('settings.notificationsDesc') }}</p>
          </div>
          <label class="switch">
            <input 
              type="checkbox" 
              :checked="settings.notifications"
              @change="handleToggleNotifications"
            />
            <span class="slider"></span>
          </label>
        </div>
        
        <div class="setting-item">
          <div class="setting-info">
            <h3>{{ t('settings.language') }}</h3>
            <p>{{ t('settings.languageDesc') }}</p>
          </div>
          <select :value="settings.locale" @change="handleChangeLanguage" class="language-select">
            <option value="ru">🇷🇺 Русский</option>
            <option value="en">🇬🇧 English</option>
            <option value="de">🇩🇪 Deutsch</option>
            <option value="fr">🇫🇷 Français</option>
            <option value="be">🇧🇾 Беларуская</option>
            <option value="kk">🇰🇿 Қазақша</option>
            <option value="pl">🇵🇱 Polski</option>
            <option value="sv">🇸🇪 Svenska</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useSettings } from '~/composables/useSettings'
import { useLanguage } from '~/composables/useLanguage'
import { useNotifications } from '~/composables/useNotifications'

const { t } = useI18n()
const { settings, toggleNotifications } = useSettings()
const { setLocale, getLanguageName } = useLanguage()
const { addNotification } = useNotifications()

const handleToggleNotifications = () => {
  const enabled = toggleNotifications()
  if (enabled) {
    addNotification(t('notifications.notificationsOn'), 'success')
  } else {
    addNotification(t('notifications.notificationsOff'), 'error')
  }
}

const handleChangeLanguage = (event) => {
  const newLocale = event.target.value
  setLocale(newLocale)
  
  if (settings.value.notifications) {
    const languageName = getLanguageName(newLocale)
    const messages = {
      ru: `Язык изменён на ${languageName}`,
      en: `Language changed to ${languageName}`,
      de: `Sprache auf ${languageName} geändert`,
      fr: `Langue changée en ${languageName}`,
      be: `Мова зменена на ${languageName}`,
      kk: `Тіл ${languageName} тіліне өзгертілді`,
      pl: `Język zmieniony na ${languageName}`,
      sv: `Språk ändrat till ${languageName}`
    }
    addNotification(messages[newLocale] || `Language changed to ${languageName}`, 'success')
  }
}

useHead({
  title: 'Настройки - MedSkills'
})
</script>

<style scoped>
.settings-page {
  min-height: 100vh;
  background: #f0f4f8;
  padding: 20px;
}

.container {
  max-width: 800px;
  margin: 0 auto;
}

.section-header {
  margin-bottom: 30px;
}

.section-header h2 {
  font-size: 32px;
  font-weight: 700;
  color: #1e293b;
}

.settings-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 0;
  border-bottom: 1px solid #e2e8f0;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-info h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
}

.setting-info p {
  font-size: 14px;
  color: #64748b;
}

.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 26px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #cbd5e1;
  transition: 0.3s;
  border-radius: 26px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #3b82f6;
}

input:checked + .slider:before {
  transform: translateX(24px);
}

.language-select {
  padding: 8px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  min-width: 220px;
}
</style>