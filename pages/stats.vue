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
        
        <!-- Кнопка сброса (для разработки) -->
        <button class="reset-btn" @click="resetAllTests" style="display: none;">
          Сбросить все тесты
        </button>
        
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
import { useTests } from '~/composables/useTests'

const { t, locale } = useI18n()
const { tests, resetAllTests } = useTests()

const categories = [
  { id: 'traumatology', nameKey: 'tests.traumatology', icon: '🦴' },
  { id: 'cardiology', nameKey: 'tests.cardiology', icon: '❤️' },
  { id: 'rehabilitation', nameKey: 'tests.rehabilitation', icon: '🏋️' },
  { id: 'nutrition', nameKey: 'tests.nutrition', icon: '🥗' }
]

// Общая статистика
const totalTests = computed(() => tests.value.length)
const completedTests = computed(() => tests.value.filter(t => t.status === 'completed').length)

const averageScore = computed(() => {
  const completed = tests.value.filter(t => t.status === 'completed' && t.score)
  if (completed.length === 0) return 0
  const sum = completed.reduce((acc, t) => acc + t.score, 0)
  return Math.round(sum / completed.length)
})

const totalTimeHours = computed(() => Math.round(completedTests.value * 0.5))

// Статистика по категориям
const categoriesStats = computed(() => {
  return categories.map(cat => {
    const catTests = tests.value.filter(t => t.category === cat.id)
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
  return tests.value
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
.stats-page { min-height: 100vh; background: var(--bg-primary); padding: 20px; }
.container { max-width: 1200px; margin: 0 auto; }
.section-header { margin-bottom: 30px; }
.section-header h2 { font-size: 32px; font-weight: 700; color: var(--text-primary); margin-bottom: 8px; }
.subtitle { font-size: 16px; color: var(--text-secondary); }
.stats-content { display: flex; flex-direction: column; gap: 24px; }
.stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
.stat-card { background: var(--bg-secondary); border-radius: 16px; padding: 24px; display: flex; align-items: center; gap: 16px; box-shadow: var(--card-shadow); border: var(--border-width) solid var(--border-color); }
.stat-icon { font-size: 40px; width: 60px; height: 60px; background: var(--bg-unread); border-radius: 12px; display: flex; align-items: center; justify-content: center; }
.stat-info h3 { font-size: 14px; font-weight: 500; color: var(--text-secondary); margin-bottom: 4px; }
.stat-value { font-size: 28px; font-weight: 700; color: var(--text-primary); }
.categories-section { background: var(--bg-secondary); border-radius: 20px; padding: 24px; box-shadow: var(--card-shadow); border: var(--border-width) solid var(--border-color); }
.categories-section h3 { font-size: 18px; font-weight: 600; color: var(--text-primary); margin-bottom: 24px; }
.categories-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
.category-card { padding: 16px; background: var(--bg-hover); border-radius: 12px; border: var(--border-width) solid var(--border-color); }
.category-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
.category-icon { font-size: 28px; }
.category-name { font-weight: 600; color: var(--text-primary); }
.category-stats { display: flex; flex-direction: column; gap: 12px; }
.stat-row { display: flex; justify-content: space-between; font-size: 14px; color: var(--text-secondary); }
.progress-bar { height: 8px; background: var(--border-color); border-radius: 4px; overflow: hidden; }
.progress-fill { height: 100%; background: linear-gradient(90deg, #3b82f6 0%, #667eea 100%); border-radius: 4px; }
.recent-section { background: var(--bg-secondary); border-radius: 20px; padding: 24px; box-shadow: var(--card-shadow); border: var(--border-width) solid var(--border-color); }
.recent-section h3 { font-size: 18px; font-weight: 600; color: var(--text-primary); margin-bottom: 20px; }
.results-list { display: flex; flex-direction: column; gap: 12px; }
.result-item { display: flex; align-items: center; justify-content: space-between; padding: 16px; background: var(--bg-hover); border-radius: 12px; border: var(--border-width) solid var(--border-color); }
.result-info { display: flex; align-items: center; gap: 16px; }
.result-icon { font-size: 28px; width: 50px; height: 50px; background: var(--bg-secondary); border-radius: 12px; display: flex; align-items: center; justify-content: center; }
.result-details h4 { font-size: 16px; font-weight: 600; color: var(--text-primary); margin-bottom: 4px; }
.result-details p { font-size: 13px; color: var(--text-secondary); }
.result-score { font-size: 24px; font-weight: 700; padding: 8px 16px; border-radius: 12px; }
.result-score.excellent { background: #d1fae5; color: #059669; }
.result-score.good { background: #dbeafe; color: #2563eb; }
.result-score.average { background: #fef3c7; color: #d97706; }
.result-score.poor { background: #fee2e2; color: #dc2626; }
.empty-results { text-align: center; padding: 40px; color: var(--text-secondary); }
.reset-btn { margin: 10px auto; padding: 8px 16px; background: #ef4444; color: white; border: none; border-radius: 8px; cursor: pointer; }
@media (max-width: 1024px) { .stats-row { grid-template-columns: repeat(2, 1fr); } .categories-grid { grid-template-columns: 1fr; } }
@media (max-width: 768px) { .stats-page { padding: 12px; } .stats-row { grid-template-columns: 1fr; } .result-item { flex-direction: column; align-items: flex-start; gap: 12px; } }
</style>