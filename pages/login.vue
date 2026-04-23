<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <div class="language-selector">
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
          <h1 class="auth-logo">MedSkills</h1>
          <h2>{{ t('auth.loginTitle') }}</h2>
          <p class="auth-subtitle">{{ t('auth.loginSubtitle') }}</p>
        </div>
        
        <form class="auth-form" @submit.prevent="handleLogin">
          <div class="form-group" :class="{ 'has-error': errors.email }">
            <label>{{ t('auth.email') }}</label>
            <input 
              type="email" 
              v-model="form.email"
              :placeholder="t('auth.emailPlaceholder')"
              @input="clearError('email')"
              :disabled="isLoading"
            />
            <span class="error-message" v-if="errors.email">{{ errors.email }}</span>
          </div>
          
          <div class="form-group" :class="{ 'has-error': errors.password }">
            <label>{{ t('auth.password') }}</label>
            <input 
              type="password" 
              v-model="form.password"
              :placeholder="t('auth.passwordPlaceholder')"
              @input="clearError('password')"
              :disabled="isLoading"
            />
            <span class="error-message" v-if="errors.password">{{ errors.password }}</span>
          </div>
          
          <div class="form-options">
            <label class="checkbox-label">
              <input type="checkbox" v-model="form.remember" />
              <span>{{ t('auth.rememberMe') }}</span>
            </label>
            <a href="#" class="forgot-link" @click.prevent="goToResetPassword">
              {{ t('auth.forgotPassword') }}
            </a>
          </div>
          
          <button type="submit" class="btn btn-primary btn-block" :disabled="isLoading">
            <span v-if="isLoading">{{ t('auth.loggingIn') }}</span>
            <span v-else>{{ t('auth.login') }}</span>
          </button>
        </form>
        
        <div class="auth-footer">
          <p>{{ t('auth.noAccount') }} <a href="#" @click.prevent="goToRegister">{{ t('auth.register') }}</a></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuth } from '~/composables/useAuth'
import { useLanguage } from '~/composables/useLanguage'
import { useNotifications } from '~/composables/useNotifications'
import { LANGUAGE_CHANGE_MESSAGES } from '~/constants/languages'

const router = useRouter()
const { t } = useI18n()
const { login } = useAuth()
const { currentLocale, languages, setLocale, getLanguageName } = useLanguage()
const { addNotification } = useNotifications()

const form = ref({
  email: '',
  password: '',
  remember: false
})

const errors = reactive({
  email: '',
  password: ''
})

const isLoading = ref(false)
const showLanguages = ref(false)

const currentLanguage = computed(() => 
  languages.find(l => l.code === currentLocale.value) || languages[0]
)

const changeLanguage = (code) => {
  setLocale(code)
  showLanguages.value = false
  
  const langName = getLanguageName(code)
  const messageFunc = LANGUAGE_CHANGE_MESSAGES[code] || LANGUAGE_CHANGE_MESSAGES.en
  addNotification(messageFunc(langName), 'success')
}

const clearError = (field) => {
  errors[field] = ''
}

const validateForm = () => {
  errors.email = ''
  errors.password = ''
  
  if (!form.value.email || form.value.email.trim().length === 0) {
    errors.email = t('validation.emailRequired')
    return false
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.value.email)) {
    errors.email = t('validation.emailInvalid')
    return false
  }
  
  if (!form.value.password || form.value.password.trim().length === 0) {
    errors.password = t('auth.passwordRequired')
    return false
  }
  
  return true
}

const handleLogin = async () => {
  if (!validateForm()) {
    return
  }
  
  isLoading.value = true
  
  try {
    const result = await login(form.value.email, form.value.password)
    if (result.success) {
      if (form.value.remember && process.client) {
        localStorage.setItem('medskills_remember', form.value.email)
      }
      router.push('/')
    }
  } catch (error) {
    if (error.error) {
      errors.password = error.error
    }
  } finally {
    isLoading.value = false
  }
}

const goToRegister = () => {
  router.push('/register')
}

const goToResetPassword = () => {
  router.push('/reset-password')
}

const handleClickOutside = (e) => {
  if (!e.target.closest('.language-selector')) {
    showLanguages.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  
  const remembered = localStorage.getItem('medskills_remember')
  if (remembered) {
    form.value.email = remembered
    form.value.remember = true
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

useHead({
  title: t('auth.loginTitle') + ' - MedSkills'
})
</script>

<style>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.auth-container {
  width: 100%;
  max-width: 420px;
}

.auth-card {
  background: var(--bg-secondary, #ffffff);
  border-radius: 24px;
  padding: 40px 32px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: var(--border-width, 1.5px) solid var(--border-color, #94a3b8);
}

.auth-header {
  text-align: center;
  margin-bottom: 32px;
  position: relative;
}

.language-selector {
  position: absolute;
  top: -10px;
  right: -10px;
}

.language-btn {
  gap: 8px;
  padding: 8px 12px;
  background: var(--bg-secondary, #ffffff);
  border: var(--border-width, 1.5px) solid var(--border-color, #94a3b8);
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: var(--text-primary, #0f172a);
}

.language-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: var(--bg-secondary, #ffffff);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 200px;
  z-index: 1000;
  border: var(--border-width, 1.5px) solid var(--border-color, #94a3b8);
}

.language-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.2s;
  color: var(--text-primary, #0f172a);
}

.language-item:hover {
  background: var(--bg-hover, #f8fafc);
}

.lang-short {
  font-weight: 600;
  color: #3b82f6;
  min-width: 32px;
}

.auth-logo {
  font-size: 32px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;
}

.auth-header h2 {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary, #0f172a);
  margin-bottom: 8px;
}

.auth-subtitle {
  font-size: 14px;
  color: var(--text-secondary, #334155);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary, #0f172a);
}

.form-group input {
  padding: 14px 16px;
  background: var(--bg-input, #ffffff);
  color: var(--text-primary, #0f172a);
  border: var(--border-width, 1.5px) solid var(--border-color, #94a3b8);
  border-radius: 12px;
  font-size: 15px;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #3b82f6;
}

.form-group input:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.form-group.has-error input {
  border-color: #ef4444;
}

.error-message {
  font-size: 13px;
  color: #ef4444;
  font-weight: 500;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--text-secondary, #334155);
  cursor: pointer;
}

.checkbox-label input {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.forgot-link {
  font-size: 14px;
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
}

.forgot-link:hover {
  text-decoration: underline;
}

.btn {
  padding: 14px 24px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #3b82f6;
  color: white;
  border: var(--border-width, 1.5px) solid #3b82f6;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
  border-color: #2563eb;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-block {
  width: 100%;
}

.auth-footer {
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
  color: var(--text-secondary, #334155);
}

.auth-footer a {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 600;
}

.auth-footer a:hover {
  text-decoration: underline;
}

.dark .auth-card {
  background: var(--bg-secondary, #1e293b);
  border-color: var(--border-color, #64748b);
}

.dark .auth-header h2 {
  color: var(--text-primary, #f8fafc);
}

.dark .auth-subtitle {
  color: var(--text-secondary, #e2e8f0);
}

.dark .form-group label {
  color: var(--text-primary, #f8fafc);
}

.dark .form-group input {
  background: var(--bg-input, #0f172a);
  color: var(--text-primary, #f8fafc);
  border-color: var(--border-color, #64748b);
}

.dark .checkbox-label {
  color: var(--text-secondary, #e2e8f0);
}

.dark .auth-footer {
  color: var(--text-secondary, #e2e8f0);
}

.dark .language-btn {
  background: var(--bg-secondary, #1e293b);
  border-color: var(--border-color, #64748b);
  color: var(--text-primary, #f8fafc);
}

.dark .language-dropdown {
  background: var(--bg-secondary, #1e293b);
  border-color: var(--border-color, #64748b);
}

.dark .language-item {
  color: var(--text-primary, #f8fafc);
}

.dark .language-item:hover {
  background: var(--bg-hover, #334155);
}
</style>