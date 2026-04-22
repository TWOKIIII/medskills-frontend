<template>
  <div class="profile-page">
    <div class="container">
      <AppHeader />
      <AppNavigation />
      
      <div class="profile-card">
        <div class="profile-header">
          <div class="avatar-large">👨‍⚕️</div>
          <h2>{{ profile.name || t('profile.notSpecified') }}</h2>
          <p class="specialization">{{ profile.specialization || t('profile.notSpecified') }}</p>
        </div>
        
        <div class="profile-info">
          <div class="info-section">
            <h3>{{ t('profile.personalInfo') }}</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="label">{{ t('profile.email') }}</span>
                <span class="value">{{ profile.email || t('profile.notSpecified') }}</span>
              </div>
              <div class="info-item">
                <span class="label">{{ t('profile.phone') }}</span>
                <span class="value">{{ profile.phone || t('profile.notSpecified') }}</span>
              </div>
              <div class="info-item">
                <span class="label">{{ t('profile.birthDate') }}</span>
                <span class="value">{{ profile.birthDate || t('profile.notSpecified') }}</span>
              </div>
              <div class="info-item">
                <span class="label">{{ t('profile.experience') }}</span>
                <span class="value">{{ profile.experience || t('profile.notSpecified') }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="profile-actions">
          <button class="btn btn-primary" @click="openEditModal">{{ t('profile.edit') }}</button>
          <button class="btn btn-secondary" @click="handleLogout">{{ t('app.logout') }}</button>
        </div>
      </div>
    </div>
    
    <div class="modal" v-if="showEditModal" @click="closeEditModal">
      <div class="modal-content" @click.stop>
        <h3>{{ t('profile.edit') }}</h3>
        
        <div class="form-group" :class="{ 'has-error': errors.name }">
          <label>{{ t('profile.name') }}</label>
          <input type="text" v-model="editForm.name" @input="clearError('name')" />
          <span class="error-message" v-if="errors.name">{{ errors.name }}</span>
        </div>
        
        <div class="form-group" :class="{ 'has-error': errors.email }">
          <label>{{ t('profile.email') }}</label>
          <input type="email" v-model="editForm.email" @input="clearError('email')" />
          <span class="error-message" v-if="errors.email">{{ errors.email }}</span>
        </div>
        
        <div class="form-group" :class="{ 'has-error': errors.phone }">
          <label>{{ t('profile.phone') }}</label>
          <input type="tel" v-model="editForm.phone" @input="clearError('phone')" />
          <span class="error-message" v-if="errors.phone">{{ errors.phone }}</span>
        </div>
        
        <div class="form-group" :class="{ 'has-error': errors.specialization }">
          <label>{{ t('profile.specialization') }}</label>
          <input type="text" v-model="editForm.specialization" @input="clearError('specialization')" />
          <span class="error-message" v-if="errors.specialization">{{ errors.specialization }}</span>
        </div>
        
        <div class="form-group">
          <label>{{ t('profile.birthDate') }}</label>
          <input type="date" v-model="editForm.birthDate" />
        </div>
        
        <div class="form-group">
          <label>{{ t('profile.experience') }}</label>
          <input type="text" v-model="editForm.experience" :placeholder="t('profile.experiencePlaceholder')" />
        </div>
        
        <div class="modal-actions">
          <button class="btn btn-primary" @click="saveProfile" :disabled="isSaving">
            {{ isSaving ? '...' : t('profile.save') }}
          </button>
          <button class="btn btn-secondary" @click="closeEditModal">{{ t('profile.cancel') }}</button>
        </div>
      </div>
    </div>
    
    <div class="modal confirm-modal" v-if="showLogoutConfirm" @click="showLogoutConfirm = false">
      <div class="modal-content" @click.stop>
        <h3>{{ t('auth.logoutConfirm') }}</h3>
        <p>{{ t('auth.logoutConfirmDesc') }}</p>
        <div class="modal-actions">
          <button class="btn btn-danger" @click="confirmLogout" :disabled="isLoggingOut">
            {{ isLoggingOut ? '...' : t('app.logout') }}
          </button>
          <button class="btn btn-secondary" @click="showLogoutConfirm = false">
            {{ t('profile.cancel') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useProfile } from '~/composables/useProfile'
import { useNotifications } from '~/composables/useNotifications'
import { useAuth } from '~/composables/useAuth'

const router = useRouter()
const { t } = useI18n()
const { profile, saveProfile: updateProfile, validateName, validateEmail, validatePhone, loadProfile, syncWithUser } = useProfile()
const { addNotification } = useNotifications()
const { logout, user } = useAuth()

const showEditModal = ref(false)
const showLogoutConfirm = ref(false)
const isSaving = ref(false)
const isLoggingOut = ref(false)

const editForm = ref({
  name: '',
  email: '',
  phone: '',
  specialization: '',
  birthDate: '',
  experience: ''
})

const errors = reactive({
  name: '',
  email: '',
  phone: '',
  specialization: ''
})

const clearError = (field) => {
  errors[field] = ''
}

const validateForm = () => {
  errors.name = ''
  errors.email = ''
  errors.phone = ''
  errors.specialization = ''
  
  const nameValidation = validateName(editForm.value.name)
  if (!nameValidation.valid) {
    errors.name = t(nameValidation.error)
    return false
  }
  
  const emailValidation = validateEmail(editForm.value.email)
  if (!emailValidation.valid) {
    errors.email = t(emailValidation.error)
    return false
  }
  
  const phoneValidation = validatePhone(editForm.value.phone)
  if (!phoneValidation.valid) {
    errors.phone = t(phoneValidation.error)
    return false
  }
  
  if (!editForm.value.specialization || editForm.value.specialization.trim().length === 0) {
    errors.specialization = t('validation.specializationRequired')
    return false
  }
  
  return true
}

const openEditModal = () => {
  editForm.value = {
    name: profile.value.name || '',
    email: profile.value.email || '',
    phone: profile.value.phone || '',
    specialization: profile.value.specialization || '',
    birthDate: profile.value.birthDate || '',
    experience: profile.value.experience || ''
  }
  errors.name = ''
  errors.email = ''
  errors.phone = ''
  errors.specialization = ''
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  isSaving.value = false
}

const saveProfile = async () => {
  if (!validateForm()) {
    return
  }
  
  isSaving.value = true
  
  const result = updateProfile(editForm.value)
  
  if (result.success) {
    closeEditModal()
    addNotification(t('notifications.profileUpdated'), 'success')
  } else {
    addNotification(t('validation.saveError'), 'error')
  }
  
  isSaving.value = false
}

const handleLogout = () => {
  showLogoutConfirm.value = true
}

const confirmLogout = async () => {
  isLoggingOut.value = true
  
  try {
    await logout()
    showLogoutConfirm.value = false
  } catch (error) {
    addNotification(t('auth.logoutError'), 'error')
  } finally {
    isLoggingOut.value = false
  }
}

watch(user, (newUser) => {
  if (newUser) {
    syncWithUser()
  }
}, { immediate: true })

onMounted(() => {
  loadProfile()
  syncWithUser()
})

useHead({
  title: t('profile.title') + ' - MedSkills'
})
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: var(--bg-primary);
  padding: 20px;
}

.container {
  max-width: 900px;
  margin: 0 auto;
}

.profile-card {
  background: var(--bg-secondary);
  border-radius: 24px;
  padding: 32px;
  box-shadow: var(--card-shadow);
  border: var(--border-width) solid var(--border-color);
}

.profile-header {
  text-align: center;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: var(--border-width) solid var(--border-color);
}

.avatar-large {
  font-size: 80px;
  margin-bottom: 16px;
}

.profile-header h2 {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.specialization {
  font-size: 16px;
  color: var(--text-secondary);
}

.profile-info {
  margin-bottom: 32px;
}

.info-section h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 16px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item .label {
  font-size: 13px;
  color: var(--text-tertiary);
}

.info-item .value {
  font-size: 16px;
  color: var(--text-primary);
  font-weight: 500;
}

.profile-actions {
  display: flex;
  gap: 16px;
  padding-top: 24px;
  border-top: var(--border-width) solid var(--border-color);
}

.btn {
  padding: 12px 24px;
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
  border: var(--border-width) solid #3b82f6;
}

.btn-primary:hover {
  background: #2563eb;
  border-color: #2563eb;
}

.btn-primary:disabled {
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
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  border: var(--border-width) solid var(--border-color);
}

.modal-content h3 {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 24px;
}

.confirm-modal .modal-content {
  max-width: 400px;
}

.confirm-modal p {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 24px;
  line-height: 1.5;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.form-group input {
  width: 100%;
  padding: 12px;
  background: var(--bg-input);
  color: var(--text-primary);
  border: var(--border-width) solid var(--border-color);
  border-radius: 8px;
  font-size: 15px;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #3b82f6;
}

.form-group.has-error input {
  border-color: #ef4444;
}

.error-message {
  display: block;
  margin-top: 6px;
  font-size: 13px;
  color: #ef4444;
  font-weight: 500;
}

.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .profile-actions {
    flex-direction: column;
  }
}
</style>