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
        <!-- FAQ -->
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
        
        <!-- Контакты -->
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
        
        <!-- Документация -->
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
        
        <!-- Форма обратной связи -->
        <div class="help-section">
          <h3>{{ t('help.support') }}</h3>
          
          <form class="support-form" @submit.prevent="sendSupport">
            <div class="form-group">
              <input type="text" :placeholder="locale === 'ru' ? 'Ваше имя' : 'Your name'" v-model="supportForm.name" />
            </div>
            <div class="form-group">
              <input type="email" placeholder="Email" v-model="supportForm.email" />
            </div>
            <div class="form-group">
              <textarea :placeholder="locale === 'ru' ? 'Опишите проблему' : 'Describe the problem'" v-model="supportForm.message" rows="4"></textarea>
            </div>
            <button type="submit" class="btn btn-primary">{{ locale === 'ru' ? 'Отправить' : 'Send' }}</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useNotifications } from '~/composables/useNotifications'

const { t, locale } = useI18n()
const { addNotification } = useNotifications()

const openFaq = ref(null)

const supportForm = ref({
  name: '',
  email: '',
  message: ''
})

const toggleFaq = (id) => {
  openFaq.value = openFaq.value === id ? null : id
}

const sendSupport = () => {
  console.log('Support form:', supportForm.value)
  const message = locale.value === 'ru' ? 'Сообщение отправлено в поддержку' : 'Message sent to support'
  addNotification(message, 'success')
  supportForm.value = { name: '', email: '', message: '' }
}

useHead({
  title: locale.value === 'ru' ? 'Помощь - MedSkills' : 'Help - MedSkills'
})
</script>

<style scoped>
.help-page {
  min-height: 100vh;
  background: #f0f4f8;
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
  color: #1e293b;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 16px;
  color: #64748b;
}

.help-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.help-section {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.help-section h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 20px;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.faq-item {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
}

.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #f8fafc;
  cursor: pointer;
  font-weight: 500;
  color: #1e293b;
  transition: background 0.2s;
}

.faq-question:hover {
  background: #f1f5f9;
}

.faq-icon {
  font-size: 20px;
  color: #3b82f6;
}

.faq-answer {
  padding: 16px 20px;
  background: white;
  color: #475569;
  line-height: 1.6;
  border-top: 1px solid #e2e8f0;
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
  background: #f8fafc;
  border-radius: 12px;
}

.contact-icon {
  font-size: 28px;
  width: 50px;
  height: 50px;
  background: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.contact-info h4 {
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 4px;
}

.contact-info p {
  font-size: 16px;
  color: #1e293b;
  font-weight: 500;
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
  background: #f8fafc;
  border-radius: 12px;
  text-decoration: none;
  color: #1e293b;
  font-weight: 500;
  transition: all 0.2s;
}

.doc-link:hover {
  background: #eff6ff;
  color: #3b82f6;
  transform: translateX(4px);
}

.support-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #e2e8f0;
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

.btn {
  padding: 14px 24px;
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

@media (max-width: 768px) {
  .contacts-grid {
    grid-template-columns: 1fr;
  }
  
  .help-page {
    padding: 12px;
  }
}
</style>