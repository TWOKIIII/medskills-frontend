<template>
  <div class="stats-page">
    <div class="container">
      <AppHeader />
      <AppNavigation />
      
      <div class="section-header">
        <h2>{{ t('statistics.title') }}</h2>
        <p class="subtitle">{{ t('statistics.subtitle') }}</p>
      </div>
      
      <div class="stats-content">
        <!-- Общая статистика -->
        <div class="stats-row">
          <div class="stat-card">
            <div class="stat-icon">📊</div>
            <div class="stat-info">
              <h3>{{ t('statistics.totalTests') }}</h3>
              <p class="stat-value">{{ totalTests }}</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">✅</div>
            <div class="stat-info">
              <h3>{{ t('statistics.completedTests') }}</h3>
              <p class="stat-value">{{ completedTests }}</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">⭐</div>
            <div class="stat-info">
              <h3>{{ t('statistics.averageScore') }}</h3>
              <p class="stat-value">{{ averageScore }}%</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">⏱️</div>
            <div class="stat-info">
              <h3>{{ t('statistics.totalTime') }}</h3>
              <p class="stat-value">{{ totalTimeHours }} {{ t('statistics.hours') }}</p>
            </div>
          </div>
        </div>
        
        <!-- Статистика по категориям -->
        <div class="categories-section">
          <h3>{{ t('statistics.byCategory') }}</h3>
          <div class="categories-grid">
            <div v-for="cat in categoriesStats" :key="cat.id" class="category-card">
              <div class="category-header">
                <span class="category-icon">{{ cat.icon }}</span>
                <span class="category-name">{{ t(cat.nameKey) }}</span>
              </div>
              <div class="category-stats">
                <div class="stat-row">
                  <span>{{ t('statistics.tests') }}:</span>
                  <span>{{ cat.completed }}/{{ cat.total }}</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: cat.percentage + '%' }"></div>
                </div>
                <div class="stat-row">
                  <span>{{ t('statistics.averageScore') }}:</span>
                  <span>{{ cat.avgScore }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Последние результаты -->
        <div class="recent-section">
          <h3>{{ t('statistics.recentResults') }}</h3>
          <div class="results-list">
            <div v-for="result in recentCompletedTests" :key="result.id" class="result-item">
              <div class="result-info">
                <div class="result-icon">{{ getCategoryIcon(result.category) }}</div>
                <div class="result-details">
                  <h4>{{ t(result.titleKey) }}</h4>
                  <p>{{ t(result.categoryKey) }}</p>
                </div>
              </div>
              <div class="result-score" :class="getScoreClass(result.score)">
                {{ result.score }}%
              </div>
            </div>
            <div v-if="recentCompletedTests.length === 0" class="empty-results">
              <p>{{ t('statistics.noCompletedTests') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

// Категории с иконками
const categories = [
  { id: 'traumatology', nameKey: 'tests.traumatology', icon: '🦴' },
  { id: 'cardiology', nameKey: 'tests.cardiology', icon: '❤️' },
  { id: 'rehabilitation', nameKey: 'tests.rehabilitation', icon: '🏋️' },
  { id: 'pharmacology', nameKey: 'tests.pharmacology', icon: '💊' },
  { id: 'nutrition', nameKey: 'tests.nutrition', icon: '🥗' },
  { id: 'biomechanics', nameKey: 'tests.biomechanics', icon: '🏃' }
]

// Все тесты (те же данные, что на странице Тестов)
const allTests = [
  // Травматология
  { id: 1, category: 'traumatology', categoryKey: 'tests.traumatology', titleKey: 'tests.traumatologyBasic', status: 'completed', progress: 100, score: 92, completedDate: '2024-03-10' },
  { id: 2, category: 'traumatology', categoryKey: 'tests.traumatology', titleKey: 'tests.traumatologyJoints', status: 'continue', progress: 65, score: null, completedDate: null },
  { id: 3, category: 'traumatology', categoryKey: 'tests.traumatology', titleKey: 'tests.traumatologySpine', status: 'new', progress: null, score: null, completedDate: null },
  
  // Кардиология
  { id: 4, category: 'cardiology', categoryKey: 'tests.cardiology', titleKey: 'tests.cardiologyECG', status: 'completed', progress: 100, score: 88, completedDate: '2024-03-05' },
  { id: 5, category: 'cardiology', categoryKey: 'tests.cardiology', titleKey: 'tests.cardiologyBasic', status: 'continue', progress: 42, score: null, completedDate: null },
  { id: 6, category: 'cardiology', categoryKey: 'tests.cardiology', titleKey: 'tests.cardiologyStress', status: 'new', progress: null, score: null, completedDate: null },
  
  // Реабилитация
  { id: 7, category: 'rehabilitation', categoryKey: 'tests.rehabilitation', titleKey: 'tests.rehabilitationBasic', status: 'completed', progress: 100, score: 95, completedDate: '2024-02-28' },
  { id: 8, category: 'rehabilitation', categoryKey: 'tests.rehabilitation', titleKey: 'tests.rehabilitationPostOp', status: 'continue', progress: 28, score: null, completedDate: null },
  { id: 9, category: 'rehabilitation', categoryKey: 'tests.rehabilitation', titleKey: 'tests.rehabilitationSports', status: 'new', progress: null, score: null, completedDate: null },
  
  // Фармакология
  { id: 10, category: 'pharmacology', categoryKey: 'tests.pharmacology', titleKey: 'tests.pharmacologyDoping', status: 'completed', progress: 100, score: 78, completedDate: '2024-02-20' },
  { id: 11, category: 'pharmacology', categoryKey: 'tests.pharmacology', titleKey: 'tests.pharmacologyBasic', status: 'continue', progress: 73, score: null, completedDate: null },
  { id: 12, category: 'pharmacology', categoryKey: 'tests.pharmacology', titleKey: 'tests.nutritionRecovery', status: 'new', progress: null, score: null, completedDate: null },
  
  // Питание
  { id: 13, category: 'nutrition', categoryKey: 'tests.nutrition', titleKey: 'tests.nutritionBasic', status: 'completed', progress: 100, score: 96, completedDate: '2024-03-12' },
  { id: 14, category: 'nutrition', categoryKey: 'tests.nutrition', titleKey: 'tests.nutritionCompetition', status: 'continue', progress: 51, score: null, completedDate: null },
  { id: 15, category: 'nutrition', categoryKey: 'tests.nutrition', titleKey: 'tests.nutritionRecovery', status: 'new', progress: null, score: null, completedDate: null },
  
  // Биомеханика
  { id: 16, category: 'biomechanics', categoryKey: 'tests.biomechanics', titleKey: 'tests.biomechanicsBasic', status: 'completed', progress: 100, score: 85, completedDate: '2024-03-01' },
  { id: 17, category: 'biomechanics', categoryKey: 'tests.biomechanics', titleKey: 'tests.biomechanicsRunning', status: 'continue', progress: 39, score: null, completedDate: null },
  { id: 18, category: 'biomechanics', categoryKey: 'tests.biomechanics', titleKey: 'tests.traumatologyAdvanced', status: 'new', progress: null, score: null, completedDate: null }
]

// Общая статистика
const totalTests = computed(() => allTests.length)
const completedTests = computed(() => allTests.filter(t => t.status === 'completed').length)

const averageScore = computed(() => {
  const completed = allTests.filter(t => t.status === 'completed' && t.score)
  if (completed.length === 0) return 0
  const sum = completed.reduce((acc, t) => acc + t.score, 0)
  return Math.round(sum / completed.length)
})

// Примерное время (по 30 минут на тест)
const totalTimeHours = computed(() => Math.round(completedTests.value * 0.5))

// Статистика по категориям
const categoriesStats = computed(() => {
  return categories.map(cat => {
    const catTests = allTests.filter(t => t.category === cat.id)
    const completed = catTests.filter(t => t.status === 'completed' && t.score)
    const total = catTests.length
    const completedCount = completed.length
    const percentage = total > 0 ? Math.round((completedCount / total) * 100) : 0
    const avgScore = completed.length > 0 
      ? Math.round(completed.reduce((acc, t) => acc + t.score, 0) / completed.length) 
      : 0
    
    return {
      ...cat,
      total,
      completed: completedCount,
      percentage,
      avgScore
    }
  })
})

// Последние завершённые тесты
const recentCompletedTests = computed(() => {
  return allTests
    .filter(t => t.status === 'completed' && t.completedDate)
    .sort((a, b) => new Date(b.completedDate) - new Date(a.completedDate))
    .slice(0, 5)
})

const getCategoryIcon = (categoryId) => {
  const cat = categories.find(c => c.id === categoryId)
  return cat ? cat.icon : '📋'
}

const getScoreClass = (score) => {
  if (score >= 90) return 'excellent'
  if (score >= 75) return 'good'
  if (score >= 60) return 'average'
  return 'poor'
}

useHead({
  title: locale.value === 'ru' ? 'Статистика - MedSkills' : 'Statistics - MedSkills'
})
</script>

<style scoped>
.stats-page {
  min-height: 100vh;
  background: #f0f4f8;
  padding: 20px;
}

.container {
  max-width: 1200px;
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

.stats-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Общая статистика */
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.stat-icon {
  font-size: 40px;
  width: 60px;
  height: 60px;
  background: #eff6ff;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-info h3 {
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
}

/* Статистика по категориям */
.categories-section {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.categories-section h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 24px;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.category-card {
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
}

.category-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.category-icon {
  font-size: 28px;
}

.category-name {
  font-weight: 600;
  color: #1e293b;
}

.category-stats {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #64748b;
}

.progress-bar {
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6 0%, #667eea 100%);
  border-radius: 4px;
}

/* Последние результаты */
.recent-section {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.recent-section h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 20px;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.result-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
}

.result-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.result-icon {
  font-size: 28px;
  width: 50px;
  height: 50px;
  background: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.result-details h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
}

.result-details p {
  font-size: 13px;
  color: #64748b;
}

.result-score {
  font-size: 24px;
  font-weight: 700;
  padding: 8px 16px;
  border-radius: 12px;
}

.result-score.excellent {
  background: #d1fae5;
  color: #059669;
}

.result-score.good {
  background: #dbeafe;
  color: #2563eb;
}

.result-score.average {
  background: #fef3c7;
  color: #d97706;
}

.result-score.poor {
  background: #fee2e2;
  color: #dc2626;
}

.empty-results {
  text-align: center;
  padding: 40px;
  color: #64748b;
}

@media (max-width: 1024px) {
  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .categories-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .stats-page {
    padding: 12px;
  }
  
  .stats-row {
    grid-template-columns: 1fr;
  }
  
  .result-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>