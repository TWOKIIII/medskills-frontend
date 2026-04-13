<template>
  <div class="profile-page">
    <div class="container">
      <AppHeader />
      <AppNavigation />
      
      <div class="profile-card">
        <div class="profile-header">
          <div class="avatar-large">👨‍⚕️</div>
          <h2>{{ profile.name }}</h2>
          <p class="specialization">{{ profile.specialization }}</p>
        </div>
        
        <div class="profile-info">
          <div class="info-section">
            <h3>{{ t('profile.personalInfo') }}</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="label">{{ t('profile.email') }}</span>
                <span class="value">{{ profile.email }}</span>
              </div>
              <div class="info-item">
                <span class="label">{{ t('profile.phone') }}</span>
                <span class="value">{{ profile.phone }}</span>
              </div>
              <div class="info-item">
                <span class="label">{{ t('profile.birthDate') }}</span>
                <span class="value">{{ profile.birthDate }}</span>
              </div>
              <div class="info-item">
                <span class="label">{{ t('profile.experience') }}</span>
                <span class="value">{{ profile.experience }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="profile-actions">
          <button class="btn btn-primary" @click="openEditModal">{{ t('profile.edit') }}</button>
          <button class="btn btn-secondary" @click="logout">{{ t('app.logout') }}</button>
        </div>
      </div>
    </div>
    
    <!-- Модальное окно -->
    <div class="modal" v-if="showEditModal" @click="closeEditModal">
      <div class="modal-content" @click.stop>
        <h3>{{ t('profile.edit') }}</h3>
        
        <div class="form-group">
          <label>{{ t('profile.name') }}</label>
          <input type="text" v-model="editForm.name" />
        </div>
        
        <div class="form-group">
          <label>{{ t('profile.email') }}</label>
          <input type="email" v-model="editForm.email" />
        </div>
        
        <div class="form-group">
          <label>{{ t('profile.phone') }}</label>
          <input type="tel" v-model="editForm.phone" />
        </div>
        
        <div class="form-group">
          <label>{{ t('profile.specialization') }}</label>
          <input type="text" v-model="editForm.specialization" />
        </div>
        
        <div class="modal-actions">
          <button class="btn btn-primary" @click="saveProfile">{{ t('profile.save') }}</button>
          <button class="btn btn-secondary" @click="closeEditModal">{{ t('profile.cancel') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useProfile } from '~/composables/useProfile'
import { useNotifications } from '~/composables/useNotifications'

const router = useRouter()
const { t } = useI18n()
const { profile, loadProfile, saveProfile: updateProfile } = useProfile()
const { addNotification } = useNotifications()

const showEditModal = ref(false)
const editForm = ref({
  name: '',
  email: '',
  phone: '',
  specialization: ''
})

const openEditModal = () => {
  editForm.value = {
    name: profile.value.name,
    email: profile.value.email,
    phone: profile.value.phone,
    specialization: profile.value.specialization
  }
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
}

const saveProfile = () => {
  updateProfile(editForm.value)
  closeEditModal()
  addNotification(t('notifications.profileUpdated'), 'success')
}

const logout = () => {
  console.log('Выход')
}

onMounted(() => {
  loadProfile()
})

useHead({
  title: 'Профиль - MedSkills'
})
</script>

<style scoped>
/* Стили без изменений */
.profile-page {
  min-height: 100vh;
  background: #f0f4f8;
  padding: 20px;
}

.container {
  max-width: 900px;
  margin: 0 auto;
}

.profile-card {
  background: white;
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.profile-header {
  text-align: center;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e2e8f0;
}

.avatar-large {
  font-size: 80px;
  margin-bottom: 16px;
}

.profile-header h2 {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
}

.specialization {
  font-size: 16px;
  color: #64748b;
}

.profile-info {
  margin-bottom: 32px;
}

.info-section h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
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
  color: #64748b;
}

.info-item .value {
  font-size: 16px;
  color: #1e293b;
  font-weight: 500;
}

.profile-actions {
  display: flex;
  gap: 16px;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
}

.btn {
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
}

.btn-secondary {
  background: #f1f5f9;
  color: #64748b;
}

.btn-secondary:hover {
  background: #e2e8f0;
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
  background: white;
  border-radius: 20px;
  padding: 32px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content h3 {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
  margin-bottom: 8px;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 15px;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #3b82f6;
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