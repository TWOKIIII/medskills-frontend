<template>
  <div class="tests-page">
    <div class="container">
      <AppHeader />
      <AppNavigation />

      <div class="section-header">
        <h2>{{ t('tests.title') }}</h2>
        <p class="subtitle">{{ t('tests.subtitle') }}</p>
      </div>

      <div class="main-content">
        <div class="tests-section">
          <div class="tests-container">
            <TestCard
              v-for="(test, index) in testsList"
              :key="test.id"
              :title="t(test.titleKey)"
              :description="t(test.descriptionKey)"
              :status="test.status"
              :progress="test.progress"
              :index="index"
              @action="handleTestAction"
            />
          </div>
        </div>

        <div class="info-section">
          <div class="specialization-info">
            <div class="info-card">
              <div class="info-icon">🏥</div>
              <div class="info-content">
                <h4>{{ t('doctor.specialization') }}</h4>
                <p>{{ t('doctor.specializationDesc') }}</p>
              </div>
            </div>
          </div>

          <div class="stats-card">
            <h3>{{ t('doctor.stats') }}</h3>
            <div class="stats-grid">
              <div class="stat-item">
                <div class="stat-value">12</div>
                <div class="stat-label">{{ t('doctor.testsPassed') }}</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">85%</div>
                <div class="stat-label">{{ t('doctor.averageScore') }}</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">3</div>
                <div class="stat-label">{{ t('doctor.inProgress') }}</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">156</div>
                <div class="stat-label">{{ t('doctor.hoursLearning') }}</div>
              </div>
            </div>
          </div>

          <div class="recommendations-card">
            <h3>{{ t('recommendations.title') }}</h3>
            <ul class="recommendations-list">
              <li>{{ t('recommendations.item1') }}</li>
              <li>{{ t('recommendations.item2') }}</li>
              <li>{{ t('recommendations.item3') }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const testsList = [
  {
    id: 1,
    titleKey: 'tests.traumatology',
    descriptionKey: 'tests.traumatologyDesc',
    status: 'continue',
    progress: 65
  },
  {
    id: 2,
    titleKey: 'tests.rehabilitation',
    descriptionKey: 'tests.rehabilitationDesc',
    status: 'continue',
    progress: 30
  },
  {
    id: 3,
    titleKey: 'tests.cardiology',
    descriptionKey: 'tests.cardiologyDesc',
    status: 'new',
    progress: null
  },
  {
    id: 4,
    titleKey: 'tests.pharmacology',
    descriptionKey: 'tests.pharmacologyDesc',
    status: 'completed',
    progress: 100
  },
  {
    id: 5,
    titleKey: 'tests.nutrition',
    descriptionKey: 'tests.nutritionDesc',
    status: 'new',
    progress: null
  },
  {
    id: 6,
    titleKey: 'tests.biomechanics',
    descriptionKey: 'tests.biomechanicsDesc',
    status: 'new',
    progress: null
  },
  {
    id: 7,
    titleKey: 'tests.doping',
    descriptionKey: 'tests.dopingDesc',
    status: 'continue',
    progress: 45
  }
]

const handleTestAction = (testData) => {
  console.log('Действие с тестом:', testData)
  
  if (testData.status === 'continue') {
    alert(`Продолжаем тест: ${testData.title}`)
  } else if (testData.status === 'completed') {
    alert(`Повторное прохождение: ${testData.title}`)
  } else {
    alert(`Начинаем новый тест: ${testData.title}`)
  }
}

useHead({
  title: 'Тесты - MedSkills'
})
</script>

<style scoped>
/* Твои существующие стили без изменений */
.tests-page {
  min-height: 100vh;
  background: #f0f4f8;
  padding: 20px;
}

.container {
  max-width: 1400px;
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

.main-content {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;
}

.tests-section {
  background: white;
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.tests-container {
  max-height: 700px;
  overflow-y: auto;
  padding-right: 8px;
}

.tests-container::-webkit-scrollbar {
  width: 8px;
}

.tests-container::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.tests-container::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.tests-container::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.specialization-info {
  margin: 0;
}

.info-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.info-icon {
  font-size: 40px;
  width: 70px;
  height: 70px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.info-content h4 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
}

.info-content p {
  font-size: 14px;
  opacity: 0.95;
  line-height: 1.5;
}

.stats-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.stats-card h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 13px;
  color: #64748b;
}

.recommendations-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.recommendations-card h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 16px;
}

.recommendations-list {
  list-style: none;
}

.recommendations-list li {
  padding: 12px 0;
  border-bottom: 1px solid #e2e8f0;
  color: #475569;
  font-size: 14px;
  cursor: pointer;
  transition: color 0.2s;
}

.recommendations-list li:last-child {
  border-bottom: none;
}

.recommendations-list li:hover {
  color: #3b82f6;
}

.recommendations-list li::before {
  content: "→ ";
  color: #3b82f6;
  font-weight: 600;
  margin-right: 8px;
}

@media (max-width: 1024px) {
  .main-content {
    grid-template-columns: 1fr;
  }
  
  .container {
    padding: 0;
  }
}

@media (max-width: 768px) {
  .tests-page {
    padding: 12px;
  }
  
  .section-header h2 {
    font-size: 24px;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>