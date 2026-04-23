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
            <option v-for="lang in availableLanguages" :key="lang.code" :value="lang.code">
              {{ lang.flag }} {{ lang.name }}
            </option>
          </select>
        </div>
        
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

        <div class="setting-item">
          <div class="setting-info">
            <h3>{{ t('auth.resetPassword') }}</h3>
            <p>{{ t('settings.resetPasswordDesc') }}</p>
          </div>
          <button class="btn btn-primary" @click="handleResetPassword" :disabled="isResettingPassword">
            {{ isResettingPassword ? '...' : t('auth.resetPassword') }}
          </button>
        </div>

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

    <div class="modal" v-if="showResetConfirm" @click="showResetConfirm = false">
      <div class="modal-content confirm-modal" @click.stop>
        <h3>{{ t('settings.confirmReset') }}</h3>
        <p>{{ t('settings.confirmResetDesc') }}</p>
        <div class="modal-actions">
          <button class="btn btn-danger" @click="handleResetData" :disabled="isResetting">
            {{ isResetting ? '...' : t('settings.reset') }}
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
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSettings } from '~/composables/useSettings'
import { useLanguage } from '~/composables/useLanguage'
import { useNotifications } from '~/composables/useNotifications'
import { useTheme } from '~/composables/useTheme'
import { useTests } from '~/composables/useTests'
import { useProfile } from '~/composables/useProfile'
import { useAuth } from '~/composables/useAuth'
import { LANGUAGES } from '~/constants/languages'

const { t } = useI18n()
const { settings, toggleNotifications, setTheme: setSettingsTheme, resetSettings } = useSettings()
const { setLocale, getLanguageName } = useLanguage()
const { addNotification } = useNotifications()
const { setTheme } = useTheme()
const { resetAllTests } = useTests()
const { resetProfile } = useProfile()
const { resetPassword, user } = useAuth()

const showResetConfirm = ref(false)
const isResetting = ref(false)
const isResettingPassword = ref(false)

const currentUserEmail = computed(() => user.value?.email || '')

const availableLanguages = LANGUAGES.map(lang => ({
  ...lang,
  flag: lang.flagClass.split(' ')[1] === 'fi-ru' ? '🇷🇺' : 
        lang.flagClass.split(' ')[1] === 'fi-gb' ? '🇬🇧' :
        lang.flagClass.split(' ')[1] === 'fi-de' ? '🇩🇪' :
        lang.flagClass.split(' ')[1] === 'fi-fr' ? '🇫🇷' :
        lang.flagClass.split(' ')[1] === 'fi-by' ? '🇧🇾' :
        lang.flagClass.split(' ')[1] === 'fi-kz' ? '🇰🇿' :
        lang.flagClass.split(' ')[1] === 'fi-pl' ? '🇵🇱' : '🇸🇪'
}))

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
  if (setLocale(newLocale)) {
    if (settings.value.notifications) {
      const languageName = getLanguageName(newLocale)
      addNotification(t('notifications.languageChangedMessage', { language: languageName }), 'success')
    }
  } else {
    addNotification(t('validation.languageChangeError'), 'error')
  }
}

const handleSetTheme = (theme) => {
  if (setSettingsTheme(theme)) {
    setTheme(theme === 'dark')
  }
}

const handleResetPassword = async () => {
  if (!currentUserEmail.value) {
    addNotification(t('auth.userNotFound'), 'error')
    return
  }
  
  isResettingPassword.value = true
  
  try {
    const result = await resetPassword(currentUserEmail.value)
    if (result.success) {
      addNotification(t('auth.passwordResetToDefault', { password: '111111' }), 'success')
    }
  } catch (error) {
    if (error.error) {
      addNotification(error.error, 'error')
    }
  } finally {
    isResettingPassword.value = false
  }
}

const handleResetData = () => {
  isResetting.value = true
  
  setTimeout(() => {
    if (process.client) {
      localStorage.clear()
      resetAllTests()
      resetProfile()
      resetSettings()
      
      setTimeout(() => {
        window.location.reload()
      }, 300)
    }
    
    showResetConfirm.value = false
    addNotification(t('settings.dataReset'), 'success')
    isResetting.value = false
  }, 300)
}

useHead({
  title: t('settings.title') + ' - MedSkills'
})
</script>

<style scoped>
.settings-page {
  min-height: 100vh;
  background: var(--bg-primary);
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
  color: var(--text-primary);
}

.settings-card {
  background: var(--bg-secondary);
  border-radius: 20px;
  padding: 24px;
  box-shadow: var(--card-shadow);
  border: var(--border-width) solid var(--border-color);
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 0;
  border-bottom: var(--border-width) solid var(--border-color);
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-info h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.setting-info p {
  font-size: 14px;
  color: var(--text-secondary);
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
  border: var(--border-width) solid var(--border-color);
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
  border: var(--border-width) solid var(--border-color);
  border-radius: 8px;
  font-size: 14px;
  background: var(--bg-secondary);
  color: var(--text-primary);
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
  border: var(--border-width) solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  font-weight: 600;
}

.theme-btn:hover {
  background: var(--bg-hover);
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
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #3b82f6;
  color: white;
  border: var(--border-width) solid #3b82f6;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
  border-color: #2563eb;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-danger {
  background: #ef4444;
  color: white;
  border: var(--border-width) solid #ef4444;
}

.btn-danger:hover {
  background: #dc2626;
  border-color: #dc2626;
}

.btn-danger:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: var(--btn-secondary-bg);
  color: var(--btn-secondary-text);
  border: var(--border-width) solid var(--border-color);
}

.btn-secondary:hover {
  background: var(--btn-secondary-hover);
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
}

.modal-content {
  background: var(--bg-secondary);
  border-radius: 20px;
  padding: 32px;
  max-width: 400px;
  width: 90%;
  border: var(--border-width) solid var(--border-color);
}

.confirm-modal h3 {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.confirm-modal p {
  font-size: 14px;
  color: var(--text-secondary);
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