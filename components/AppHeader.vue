<template>
  <header class="app-header">
    <h1 class="logo" @click="goToHome">MedSkills</h1>
    <div class="header-actions">
      <!-- Тёмная/светлая тема -->
      <button class="icon-btn theme-btn" @click="handleToggleTheme">
        <svg v-if="isDark" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2ZM12 20V4C16.418 4 20 7.582 20 12C20 16.418 16.418 20 12 20Z" fill="currentColor"/>
        </svg>
        <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 18C8.68629 18 6 15.3137 6 12C6 8.68629 8.68629 6 12 6C15.3137 6 18 8.68629 18 12C18 15.3137 15.3137 18 12 18Z" fill="currentColor"/>
          <path d="M12 2V4M12 20V22M4 12H2M6.34315 6.34315L4.92893 4.92893M17.6569 6.34315L19.0711 4.92893M6.34315 17.6569L4.92893 19.0711M17.6569 17.6569L19.0711 19.0711M22 12H20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
      
      <!-- Колокольчик с уведомлениями -->
      <div class="notification-wrapper">
        <button class="icon-btn" @click="showNotifications = !showNotifications">
          <div class="notification-badge" v-if="unreadCount > 0">{{ unreadCount }}</div>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" fill="currentColor"/>
          </svg>
        </button>
        
        <div class="notifications-dropdown" v-if="showNotifications" @click.stop>
          <div class="dropdown-header">
            <span>{{ t('notifications.title') }}</span>
            <button @click="clearAll" v-if="notifications.length">{{ t('notifications.clear') }}</button>
          </div>
          <div class="notifications-list">
            <div v-if="notifications.length === 0" class="empty">
              {{ t('notifications.empty') }}
            </div>
            <div 
              v-for="n in notifications" 
              :key="n.id"
              class="notification-item"
              :class="{ unread: !n.read }"
              @click="markAsRead(n.id)"
            >
              <div class="notification-message">{{ n.message }}</div>
              <div class="notification-time">{{ formatTime(n.timestamp) }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Смена языка -->
      <div class="language-wrapper">
        <button class="icon-btn language-btn" @click="showLanguages = !showLanguages">
          <span :class="currentLanguage.flagClass"></span>
          <span class="lang-text">{{ currentLanguage.short }}</span>
        </button>
        <div class="language-dropdown" v-if="showLanguages">
          <div 
            v-for="lang in languages" 
            :key="lang.code"
            class="language-item"
            @click="changeLanguage(lang.code)"
          >
            <span :class="lang.flagClass"></span>
            <span class="lang-short">{{ lang.short }}</span>
            <span>{{ lang.name }}</span>
          </div>
        </div>
      </div>
      
      <!-- Кликабельный пользователь -->
      <div class="user-info" @click="goToProfile">
        <div class="avatar">👨‍⚕️</div>
        <span class="user-name">{{ profile.shortName }}</span>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useNotifications } from '~/composables/useNotifications'
import { useLanguage } from '~/composables/useLanguage'
import { useProfile } from '~/composables/useProfile'
import { useSettings } from '~/composables/useSettings'
import { useTheme } from '~/composables/useTheme'

const router = useRouter()
const { t, locale } = useI18n()
const { notifications, markAsRead, clearAll, unreadCount, addNotification } = useNotifications()
const { currentLocale, languages, setLocale, loadLocale, getLanguageName } = useLanguage()
const { profile, loadProfile } = useProfile()
const { settings } = useSettings()
const { isDark, initTheme, toggleTheme } = useTheme()

const showNotifications = ref(false)
const showLanguages = ref(false)

const currentLanguage = computed(() => 
  languages.find(l => l.code === currentLocale.value) || languages[0]
)

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now - date
  
  if (diff < 60000) {
    // Используем перевод в зависимости от текущего языка
    const translations = {
      ru: 'только что',
      en: 'just now',
      de: 'gerade eben',
      fr: "à l'instant",
      be: 'толькі што',
      kk: 'жаңа ғана',
      pl: 'przed chwilą',
      sv: 'nyss'
    }
    return translations[locale.value] || translations.en
  }
  
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000)
    const translations = {
      ru: `${minutes} мин назад`,
      en: `${minutes} min ago`,
      de: `vor ${minutes} Min`,
      fr: `il y a ${minutes} min`,
      be: `${minutes} хв таму`,
      kk: `${minutes} мин бұрын`,
      pl: `${minutes} min temu`,
      sv: `för ${minutes} min sedan`
    }
    return translations[locale.value] || translations.en
  }
  
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000)
    const translations = {
      ru: `${hours} ч назад`,
      en: `${hours} h ago`,
      de: `vor ${hours} Std`,
      fr: `il y a ${hours} h`,
      be: `${hours} гадз таму`,
      kk: `${hours} сағ бұрын`,
      pl: `${hours} godz temu`,
      sv: `för ${hours} tim sedan`
    }
    return translations[locale.value] || translations.en
  }
  
  return date.toLocaleDateString(locale.value === 'ru' ? 'ru-RU' : 'en-US')
}

const changeLanguage = (code) => {
  setLocale(code)
  showLanguages.value = false
  
  if (settings.value.notifications) {
    const langName = getLanguageName(code)
    const message = code === 'ru' ? `Язык изменён на ${langName}` : `Language changed to ${langName}`
    addNotification(message, 'success')
  }
}

const handleToggleTheme = () => {
  toggleTheme()
}

const goToHome = () => {
  router.push('/')
}

const goToProfile = () => {
  router.push('/profile')
}

const handleClickOutside = (e) => {
  if (!e.target.closest('.notification-wrapper')) {
    showNotifications.value = false
  }
  if (!e.target.closest('.language-wrapper')) {
    showLanguages.value = false
  }
}

onMounted(() => {
  initTheme()
  loadLocale()
  loadProfile()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 0;
  margin-bottom: 20px;
}

.logo {
  font-size: 32px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.logo:hover {
  opacity: 0.8;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.notification-wrapper,
.language-wrapper {
  position: relative;
}

.icon-btn {
  background: var(--bg-secondary, white);
  border: none;
  cursor: pointer;
  padding: 10px;
  border-radius: 12px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: relative;
  min-width: 44px;
  height: 44px;
  color: var(--text-secondary, #64748b);
}

.language-btn {
  gap: 8px;
  padding: 10px 12px;
}

.language-btn :deep(.fi) {
  width: 20px;
  height: 15px;
  border-radius: 2px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.lang-text {
  font-weight: 600;
  font-size: 13px;
  color: var(--text-secondary, #64748b);
}

.icon-btn:hover {
  background: var(--bg-hover, #f8fafc);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ef4444;
  color: white;
  font-size: 12px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 20px;
  text-align: center;
}

.notifications-dropdown,
.language-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: var(--bg-secondary, white);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 280px;
  z-index: 1000;
  border: 1px solid var(--border-color, #e2e8f0);
}

.language-dropdown {
  min-width: 200px;
}

.dropdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color, #e2e8f0);
  font-weight: 600;
  color: var(--text-primary, #1e293b);
}

.dropdown-header button {
  background: none;
  border: none;
  color: #3b82f6;
  cursor: pointer;
  font-size: 14px;
}

.notifications-list {
  max-height: 400px;
  overflow-y: auto;
}

.empty {
  padding: 24px;
  text-align: center;
  color: var(--text-secondary, #64748b);
}

.notification-item {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-light, #f1f5f9);
  cursor: pointer;
  transition: background 0.2s;
}

.notification-item:hover {
  background: var(--bg-hover, #f8fafc);
}

.notification-item.unread {
  background: var(--bg-unread, #eff6ff);
}

.notification-message {
  font-size: 14px;
  color: var(--text-primary, #1e293b);
  margin-bottom: 4px;
}

.notification-time {
  font-size: 12px;
  color: var(--text-tertiary, #94a3b8);
}

.language-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.2s;
  color: var(--text-primary, #1e293b);
}

.language-item:hover {
  background: var(--bg-hover, #f8fafc);
}

.language-item :deep(.fi) {
  width: 20px;
  height: 15px;
  border-radius: 2px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.lang-short {
  font-weight: 600;
  color: #3b82f6;
  min-width: 32px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: var(--bg-secondary, white);
  border-radius: 40px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-left: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.user-info:hover {
  background: var(--bg-hover, #f8fafc);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.avatar {
  font-size: 20px;
}

.user-name {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-primary, #1e293b);
}
</style>