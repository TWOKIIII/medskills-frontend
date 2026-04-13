<template>
  <div class="tests-page">
    <div class="container">
      <AppHeader />
      <AppNavigation />

      <div class="section-header">
        <h2>{{ t('tests.title') }}</h2>
        <p class="subtitle">{{ t('tests.subtitle') }}</p>
      </div>

      <!-- Хлебные крошки -->
      <div class="breadcrumbs" v-if="selectedCategory">
        <button class="back-btn" @click="selectedCategory = null">
          <span>←</span> {{ t('tests.backToCategories') }}
        </button>
        <span class="current-category">{{ t(selectedCategory.nameKey) }}</span>
      </div>

      <div class="main-content">
        <!-- Левая колонка -->
        <div class="left-column">
          <!-- Выбор категории -->
          <div class="categories-section" v-if="!selectedCategory">
            <div class="categories-grid">
              <div 
                v-for="category in categories" 
                :key="category.id"
                class="category-card"
                @click="selectCategory(category)"
              >
                <div class="category-icon">{{ category.icon }}</div>
                <h3>{{ t(category.nameKey) }}</h3>
                <p>{{ t(category.descKey) }}</p>
                <div class="category-stats">
                  <span>{{ category.testsCount }} {{ t('tests.testsCount') }}</span>
                  <span class="arrow">→</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Тесты выбранной категории -->
          <div class="tests-section" v-else>
            <div class="category-info">
              <div class="category-header">
                <span class="category-icon-large">{{ selectedCategory.icon }}</span>
                <div>
                  <h3>{{ t(selectedCategory.nameKey) }}</h3>
                  <p>{{ t(selectedCategory.descKey) }}</p>
                </div>
              </div>
            </div>

            <div class="tests-container">
              <TestCard
                v-for="(test, index) in filteredTests"
                :key="test.id"
                :title="t(test.titleKey)"
                :description="t(test.descriptionKey)"
                :status="test.status"
                :progress="test.progress"
                :index="index"
                @action="handleTestAction(test)"
              />
              
              <div v-if="filteredTests.length === 0" class="empty-tests">
                <p>{{ t('tests.noTestsInCategory') }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Правая колонка -->
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
            <h3>{{ t('tests.categoryStats') }}</h3>
            <div class="category-progress-list">
              <div v-for="cat in categoriesWithProgress" :key="cat.id" class="category-progress-item">
                <div class="category-progress-header">
                  <span>{{ t(cat.nameKey) }}</span>
                  <span>{{ cat.progress }}%</span>
                </div>
                <div class="progress-bar-small">
                  <div class="progress-fill-small" :style="{ width: cat.progress + '%' }"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="recommendations-card">
            <h3>{{ t('recommendations.title') }}</h3>
            <ul class="recommendations-list">
              <li @click="goToRecommendedTest(1)">{{ t('recommendations.item1') }}</li>
              <li @click="goToRecommendedTest(2)">{{ t('recommendations.item2') }}</li>
              <li @click="goToRecommendedTest(3)">{{ t('recommendations.item3') }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useNotifications } from '~/composables/useNotifications'

const { t, locale } = useI18n()
const { addNotification } = useNotifications()

const selectedCategory = ref(null)

const categories = [
  { id: 'traumatology', nameKey: 'tests.traumatology', descKey: 'tests.traumatologyDesc', icon: '🦴', testsCount: 1 },
  { id: 'cardiology', nameKey: 'tests.cardiology', descKey: 'tests.cardiologyDesc', icon: '❤️', testsCount: 1 },
  { id: 'rehabilitation', nameKey: 'tests.rehabilitation', descKey: 'tests.rehabilitationDesc', icon: '🏋️', testsCount: 1 },
  { id: 'pharmacology', nameKey: 'tests.pharmacology', descKey: 'tests.pharmacologyDesc', icon: '💊', testsCount: 1 },
  { id: 'nutrition', nameKey: 'tests.nutrition', descKey: 'tests.nutritionDesc', icon: '🥗', testsCount: 1 },
  { id: 'biomechanics', nameKey: 'tests.biomechanics', descKey: 'tests.biomechanicsDesc', icon: '🏃', testsCount: 1 }
]

const allTests = [
  // Травматология - 1 тест (не начатый)
  { id: 1, category: 'traumatology', titleKey: 'tests.traumatologyBasic', descriptionKey: 'tests.traumatologyBasicDesc', status: 'new', progress: null },
  
  // Кардиология - 1 тест (не начатый)
  { id: 2, category: 'cardiology', titleKey: 'tests.cardiologyBasic', descriptionKey: 'tests.cardiologyBasicDesc', status: 'new', progress: null },
  
  // Реабилитация - 1 тест (не начатый)
  { id: 3, category: 'rehabilitation', titleKey: 'tests.rehabilitationBasic', descriptionKey: 'tests.rehabilitationBasicDesc', status: 'new', progress: null },
  
  // Фармакология - 1 тест (не начатый)
  { id: 4, category: 'pharmacology', titleKey: 'tests.pharmacologyBasic', descriptionKey: 'tests.pharmacologyBasicDesc', status: 'new', progress: null },
  
  // Питание - 1 тест (не начатый)
  { id: 5, category: 'nutrition', titleKey: 'tests.nutritionBasic', descriptionKey: 'tests.nutritionBasicDesc', status: 'new', progress: null },
  
  // Биомеханика - 1 тест (не начатый)
  { id: 6, category: 'biomechanics', titleKey: 'tests.biomechanicsBasic', descriptionKey: 'tests.biomechanicsBasicDesc', status: 'new', progress: null }
]

const filteredTests = computed(() => {
  if (!selectedCategory.value) return []
  return allTests.filter(t => t.category === selectedCategory.value.id)
})

const categoriesWithProgress = computed(() => {
  return categories.map(cat => {
    const catTests = allTests.filter(t => t.category === cat.id)
    const totalProgress = catTests.reduce((sum, t) => sum + (t.progress || 0), 0)
    const avgProgress = catTests.length > 0 ? Math.round(totalProgress / catTests.length) : 0
    return { ...cat, progress: avgProgress }
  })
})

const selectCategory = (category) => {
  selectedCategory.value = category
}

const handleTestAction = (test) => {
  return (testData) => {
    if (testData.status === 'continue') {
      addNotification(`${t('tests.continuingTest')}: ${t(test.titleKey)}`, 'info')
    } else if (testData.status === 'completed') {
      addNotification(`${t('tests.retakingTest')}: ${t(test.titleKey)}`, 'info')
    } else {
      addNotification(`${t('tests.startingTest')}: ${t(test.titleKey)}`, 'success')
    }
  }
}

const goToRecommendedTest = (recId) => {
  let targetCategory
  if (recId === 1) targetCategory = categories.find(c => c.id === 'cardiology')
  else if (recId === 2) targetCategory = categories.find(c => c.id === 'rehabilitation')
  else targetCategory = categories.find(c => c.id === 'nutrition')
  if (targetCategory) selectedCategory.value = targetCategory
}

useHead({
  title: locale.value === 'ru' ? 'Тесты - MedSkills' : 'Tests - MedSkills'
})
</script>

<style scoped>
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
  margin-bottom: 24px;
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

.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #3b82f6;
  cursor: pointer;
  transition: all 0.2s;
}

.back-btn:hover {
  background: #eff6ff;
}

.current-category {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
}

.main-content {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 24px;
}

.left-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.category-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.category-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.category-card h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
}

.category-card p {
  font-size: 14px;
  color: #64748b;
  line-height: 1.5;
  margin-bottom: 16px;
}

.category-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #3b82f6;
  font-weight: 500;
}

.category-info {
  background: white;
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.category-header {
  display: flex;
  align-items: center;
  gap: 20px;
}

.category-icon-large {
  font-size: 56px;
}

.category-header h3 {
  font-size: 24px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
}

.category-header p {
  font-size: 14px;
  color: #64748b;
}

.tests-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.empty-tests {
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 20px;
  color: #64748b;
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
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

.category-progress-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.category-progress-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.category-progress-header {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #1e293b;
}

.progress-bar-small {
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill-small {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6 0%, #667eea 100%);
  border-radius: 3px;
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

@media (max-width: 1024px) {
  .main-content {
    grid-template-columns: 1fr;
  }
  
  .categories-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .tests-page {
    padding: 12px;
  }
  
  .section-header h2 {
    font-size: 24px;
  }
  
  .category-header {
    flex-direction: column;
    text-align: center;
  }
}
</style>