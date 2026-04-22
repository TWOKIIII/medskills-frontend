<template>
  <div class="help-page">
    <div class="container">
      <AppHeader />
      <AppNavigation />
      
      <div class="section-header">
        <h2>{{ t('help.title') }}</h2>
        <p class="subtitle">{{ t('help.subtitle') }}</p>
      </div>
      
      <div class="help-content">
        <div class="help-section">
          <h3>{{ t('help.faq') }}</h3>
          
          <div class="faq-list">
            <div class="faq-item">
              <div class="faq-question" @click="toggleFaq(1)">
                <span>{{ t('help.q1') }}</span>
                <span class="faq-icon">{{ openFaq === 1 ? '−' : '+' }}</span>
              </div>
              <div class="faq-answer" v-if="openFaq === 1">
                {{ t('help.a1') }}
              </div>
            </div>
            
            <div class="faq-item">
              <div class="faq-question" @click="toggleFaq(2)">
                <span>{{ t('help.q2') }}</span>
                <span class="faq-icon">{{ openFaq === 2 ? '−' : '+' }}</span>
              </div>
              <div class="faq-answer" v-if="openFaq === 2">
                {{ t('help.a2') }}
              </div>
            </div>
            
            <div class="faq-item">
              <div class="faq-question" @click="toggleFaq(3)">
                <span>{{ t('help.q3') }}</span>
                <span class="faq-icon">{{ openFaq === 3 ? '−' : '+' }}</span>
              </div>
              <div class="faq-answer" v-if="openFaq === 3">
                {{ t('help.a3') }}
              </div>
            </div>
            
            <div class="faq-item">
              <div class="faq-question" @click="toggleFaq(4)">
                <span>{{ t('help.q4') }}</span>
                <span class="faq-icon">{{ openFaq === 4 ? '−' : '+' }}</span>
              </div>
              <div class="faq-answer" v-if="openFaq === 4">
                {{ t('help.a4') }}
              </div>
            </div>
          </div>
        </div>
        
        <div class="help-section">
          <h3>{{ t('help.contacts') }}</h3>
          
          <div class="contacts-grid">
            <div class="contact-item">
              <div class="contact-icon">📞</div>
              <div class="contact-info">
                <h4>{{ t('help.contactPhone') }}</h4>
                <p>+7 (950) 000-00-00</p>
              </div>
            </div>
            
            <div class="contact-item">
              <div class="contact-icon">✉️</div>
              <div class="contact-info">
                <h4>{{ t('help.contactEmail') }}</h4>
                <p>MedSkills@support.com</p>
              </div>
            </div>
            
            <div class="contact-item">
              <div class="contact-icon">🕐</div>
              <div class="contact-info">
                <h4>{{ t('help.contactHours') }}</h4>
                <p>{{ t('help.hours') }}</p>
              </div>
            </div>
            
            <div class="contact-item">
              <div class="contact-icon">📍</div>
              <div class="contact-info">
                <h4>{{ t('help.address') }}</h4>
                <p>{{ t('help.addressText') }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="help-section">
          <h3>{{ t('help.documentation') }}</h3>
          
          <div class="docs-list">
            <a href="#" class="doc-link" @click.prevent>
              <span>📘</span>
              <span>{{ t('help.userGuide') }}</span>
            </a>
            <a href="#" class="doc-link" @click.prevent>
              <span>📗</span>
              <span>{{ t('help.testingInstructions') }}</span>
            </a>
            <a href="#" class="doc-link" @click.prevent>
              <span>📙</span>
              <span>{{ t('help.apiDocumentation') }}</span>
            </a>
            <a href="#" class="doc-link" @click.prevent>
              <span>📕</span>
              <span>{{ t('help.faqPdf') }}</span>
            </a>
          </div>
        </div>
        
        <div class="help-section">
          <h3>{{ t('help.support') }}</h3>
          
          <form class="support-form" @submit.prevent="sendSupport">
            <div class="form-group" :class="{ 'has-error': errors.name }">
              <input 
                type="text" 
                :placeholder="t('support.yourName')" 
                v-model="supportForm.name"
                @input="errors.name = ''"
              />
              <span class="error-message" v-if="errors.name">{{ errors.name }}</span>
            </div>
            
            <div class="form-group" :class="{ 'has-error': errors.email }">
              <input 
                type="email" 
                placeholder="Email" 
                v-model="supportForm.email"
                @input="errors.email = ''"
              />
              <span class="error-message" v-if="errors.email">{{ errors.email }}</span>
            </div>
            
            <div class="form-group" :class="{ 'has-error': errors.message }">
              <textarea 
                :placeholder="t('support.describeProblem')" 
                v-model="supportForm.message" 
                rows="4"
                @input="errors.message = ''"
              ></textarea>
              <span class="error-message" v-if="errors.message">{{ errors.message }}</span>
            </div>
            
            <button type="submit" class="btn btn-primary" :disabled="isSending">
              {{ isSending ? t('support.sending') : t('support.send') }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useNotifications } from '~/composables/useNotifications'

const { t, locale } = useI18n()
const { addNotification } = useNotifications()

const openFaq = ref(null)
const isSending = ref(false)

const supportForm = ref({
  name: '',
  email: '',
  message: ''
})

const errors = reactive({
  name: '',
  email: '',
  message: ''
})

const toggleFaq = (id) => {
  openFaq.value = openFaq.value === id ? null : id
}

const validateForm = () => {
  errors.name = ''
  errors.email = ''
  errors.message = ''
  
  if (!supportForm.value.name || supportForm.value.name.trim().length < 2) {
    errors.name = t('validation.supportNameMinLength')
    return false
  }
  
  if (!supportForm.value.email || supportForm.value.email.trim().length === 0) {
    errors.email = t('validation.emailRequired')
    return false
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(supportForm.value.email)) {
    errors.email = t('validation.emailInvalid')
    return false
  }
  
  if (!supportForm.value.message || supportForm.value.message.trim().length < 10) {
    errors.message = t('validation.supportMessageMinLength')
    return false
  }
  
  return true
}

const sendSupport = () => {
  if (!validateForm()) {
    return
  }
  
  isSending.value = true
  
  setTimeout(() => {
    console.log('Support form:', supportForm.value)
    addNotification(t('support.messageSent'), 'success')
    supportForm.value = { name: '', email: '', message: '' }
    isSending.value = false
  }, 500)
}

useHead({
  title: t('help.title') + ' - MedSkills'
})
</script>

<style scoped>
.help-page {
  min-height: 100vh;
  background: var(--bg-primary);
  padding: 20px;
}

.container {
  max-width: 900px;
  margin: 0 auto;
}

.section-header {
  margin-bottom: 30px;
}

.section-header h2 {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.subtitle {
  font-size: 16px;
  color: var(--text-secondary);
}

.help-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.help-section {
  background: var(--bg-secondary);
  border-radius: 20px;
  padding: 24px;
  box-shadow: var(--card-shadow);
  border: var(--border-width) solid var(--border-color);
}

.help-section h3 {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 20px;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.faq-item {
  border: var(--border-width) solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
}

.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: var(--bg-hover);
  cursor: pointer;
  font-weight: 600;
  color: var(--text-primary);
  transition: background 0.2s;
}

.faq-question:hover {
  background: var(--bg-secondary);
}

.faq-icon {
  font-size: 20px;
  color: #3b82f6;
}

.faq-answer {
  padding: 16px 20px;
  background: var(--bg-secondary);
  color: var(--text-secondary);
  line-height: 1.6;
  border-top: var(--border-width) solid var(--border-color);
}

.contacts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.contact-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: var(--bg-hover);
  border-radius: 12px;
  border: var(--border-width) solid var(--border-color);
}

.contact-icon {
  font-size: 28px;
  width: 50px;
  height: 50px;
  background: var(--bg-secondary);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: var(--border-width) solid var(--border-color);
}

.contact-info h4 {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-tertiary);
  margin-bottom: 4px;
}

.contact-info p {
  font-size: 16px;
  color: var(--text-primary);
  font-weight: 600;
}

.docs-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.doc-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: var(--bg-hover);
  border-radius: 12px;
  text-decoration: none;
  color: var(--text-primary);
  font-weight: 600;
  transition: all 0.2s;
  border: var(--border-width) solid var(--border-color);
}

.doc-link:hover {
  background: var(--bg-unread);
  color: #3b82f6;
  transform: translateX(4px);
}

.support-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  margin-bottom: 4px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 14px 16px;
  background: var(--bg-input);
  color: var(--text-primary);
  border: var(--border-width) solid var(--border-color);
  border-radius: 12px;
  font-size: 15px;
  font-family: inherit;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3b82f6;
}

.form-group.has-error input,
.form-group.has-error textarea {
  border-color: #ef4444;
}

.error-message {
  display: block;
  margin-top: 6px;
  font-size: 13px;
  color: #ef4444;
  font-weight: 500;
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

@media (max-width: 768px) {
  .contacts-grid {
    grid-template-columns: 1fr;
  }
  
  .help-page {
    padding: 12px;
  }
}
</style>