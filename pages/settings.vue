<template>
  <div class="settings-page">
    <div class="container">
      <AppHeader />
      <AppNavigation />
      
      <div class="section-header">
        <h2>{{ t('settings.title') }}</h2>
      </div>
      
      <div class="settings-card">
        <!-- Уведомления -->
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
        
        <!-- Язык -->
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
        
        <!-- Тема -->
        <div class="setting-item">
          <div class="setting-info">
            <h3>{{ t('settings.theme') }}</h3>
            <p>{{ t('settings.themeDesc') }}</p>
          </div>
          <div class="theme-buttons">
            <button 
              class="theme-btn light" 
              :class="{ active: settings.theme === 'light' }"
              @click="handleSetTheme('light')"
            >
              ☀️ {{ t('settings.light') }}
            </button>
            <button 
              class="theme-btn dark" 
              :class="{ active: settings.theme === 'dark' }"
              @click="handleSetTheme('dark')"
            >
              🌙 {{ t('settings.dark') }}
            </button>
          </div>
        </div>

        <!-- Сброс данных -->
        <div class="setting-item">
          <div class="setting-info">
            <h3>{{ t('settings.resetData') }}</h3>
            <p>{{ t('settings.resetDataDesc') }}</p>
          </div>
          <button class="btn btn-danger" @click="showResetConfirm = true">
            {{ t('settings.reset') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Модальное окно подтверждения -->
    <div class="modal" v-if="showResetConfirm" @click="showResetConfirm = false">
      <div class="modal-content confirm-modal" @click.stop>
        <h3>{{ t('settings.confirmReset') }}</h3>
        <p>{{ t('settings.confirmResetDesc') }}</p>
        <div class="modal-actions">
          <button class="btn btn-danger" @click="handleResetData">
            {{ t('settings.reset') }}
          </button>
          <button class="btn btn-secondary" @click="showResetConfirm = false">
            {{ t('profile.cancel') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSettings } from '~/composables/useSettings'
import { useLanguage } from '~/composables/useLanguage'
import { useNotifications } from '~/composables/useNotifications'
import { useTheme } from '~/composables/useTheme'
import { useTests } from '~/composables/useTests'
import { useProfile } from '~/composables/useProfile'

const { t } = useI18n()
const { settings, toggleNotifications, setTheme: setSettingsTheme, resetSettings } = useSettings()
const { setLocale, getLanguageName } = useLanguage()
const { addNotification } = useNotifications()
const { setTheme } = useTheme()
const { resetAllTests } = useTests()
const { resetProfile } = useProfile()

const showResetConfirm = ref(false)

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
  addNotification(messages[newLocale] || messages.en, 'success')
}
}

const handleSetTheme = (theme) => {
  setSettingsTheme(theme)
  setTheme(theme === 'dark')
}

const handleResetData = () => {
  if (process.client) {
    localStorage.clear()

    resetAllTests()

    resetProfile()
    
    resetSettings()
    
    setTimeout(() => {
      window.location.reload()
    }, 500)
  }
  
  showResetConfirm.value = false
  addNotification(t('settings.dataReset'), 'success')
}

useHead({
  title: 'Настройки - MedSkills'
})
</script>

<style scoped>
.settings-page {
  min-height: 100vh;
  background: var(--bg-primary, #f0f4f8);
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
  color: var(--text-primary, #1e293b);
}

.settings-card {
  background: var(--bg-secondary, white);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 0;
  border-bottom: 1px solid var(--border-color, #e2e8f0);
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-info h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary, #1e293b);
  margin-bottom: 4px;
}

.setting-info p {
  font-size: 14px;
  color: var(--text-secondary, #64748b);
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
  padding: 10px 16px;
  border: 1px solid var(--border-color, #e2e8f0);
  border-radius: 8px;
  font-size: 14px;
  background: var(--bg-secondary, white);
  color: var(--text-primary, #1e293b);
  cursor: pointer;
  min-width: 220px;
}

.language-select:focus {
  outline: none;
  border-color: #3b82f6;
}

.theme-buttons {
  display: flex;
  gap: 12px;
}

.theme-btn {
  padding: 10px 20px;
  border: 1px solid var(--border-color, #e2e8f0);
  border-radius: 8px;
  background: var(--bg-secondary, white);
  color: var(--text-primary, #1e293b);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  font-weight: 500;
}

.theme-btn:hover {
  background: var(--bg-hover, #f8fafc);
}

.theme-btn.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover {
  background: #dc2626;
}

.btn-secondary {
  background: var(--btn-secondary-bg, #f1f5f9);
  color: var(--btn-secondary-text, #475569);
}

.btn-secondary:hover {
  background: var(--btn-secondary-hover, #e2e8f0);
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
}

.modal-content {
  background: var(--bg-secondary, white);
  border-radius: 20px;
  padding: 32px;
  max-width: 400px;
  width: 90%;
}

.confirm-modal h3 {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary, #1e293b);
  margin-bottom: 12px;
}

.confirm-modal p {
  font-size: 14px;
  color: var(--text-secondary, #64748b);
  margin-bottom: 24px;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

@media (max-width: 600px) {
  .setting-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .language-select {
    width: 100%;
    min-width: unset;
  }
  
  .theme-buttons {
    width: 100%;
  }
  
  .theme-btn {
    flex: 1;
    text-align: center;
  }
}
</style>