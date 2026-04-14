<template>
  <div class="test-passing-page">
    <div class="container">
      <AppHeader />
      
      <div class="test-header">
        <button class="back-btn" @click="goBack">
          <span>←</span> {{ t('tests.backToTests') }}
        </button>
        <div class="test-info">
          <span class="category-badge">{{ t(testInfo.categoryKey) }}</span>
          <h1>{{ t(testInfo.titleKey) }}</h1>
          <p>{{ t(testInfo.descriptionKey) }}</p>
        </div>
      </div>
      
      <div class="test-content">
        <div class="progress-section" v-if="!isCompleted">
          <div class="progress-header">
            <span>{{ t('tests.question') }} {{ currentQuestionIndex + 1 }} / {{ questions.length }}</span>
            <span>{{ progress }}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progress + '%' }"></div>
          </div>
        </div>
        
        <div class="question-section" v-if="!isCompleted">
          <h2>{{ currentQuestion.text }}</h2>
          
          <div class="options-list">
            <label 
              v-for="(option, idx) in currentQuestion.options" 
              :key="idx"
              class="option-item"
              :class="{ selected: selectedOption === idx }"
            >
              <input 
                type="radio" 
                :name="'question-' + currentQuestionIndex" 
                :value="idx"
                v-model="selectedOption"
              />
              <span class="option-text">{{ option }}</span>
            </label>
          </div>
          
          <div class="question-actions">
            <button 
              class="btn btn-secondary" 
              v-if="currentQuestionIndex > 0"
              @click="prevQuestion"
            >
              {{ t('tests.previous') }}
            </button>
            <button 
              class="btn btn-primary" 
              @click="nextQuestion"
              :disabled="selectedOption === null"
            >
              {{ currentQuestionIndex === questions.length - 1 ? t('tests.finish') : t('tests.next') }}
            </button>
          </div>
        </div>
        
        <div class="result-section" v-else>
          <div class="result-card">
            <div class="result-icon">{{ resultIcon }}</div>
            <h2>{{ t('tests.testCompleted') }}</h2>
            <div class="result-score">{{ score }} / {{ questions.length }}</div>
            <p class="result-percentage">{{ percentage }}% {{ t('tests.correctAnswers') }}</p>
            
            <div class="result-actions">
              <button class="btn btn-primary" @click="restartTest">
                {{ t('tests.retake') }}
              </button>
              <button class="btn btn-secondary" @click="goBack">
                {{ t('tests.backToTests') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useNotifications } from '~/composables/useNotifications'
import { useTests } from '~/composables/useTests'

const router = useRouter()
const { t, locale } = useI18n()
const { addNotification } = useNotifications()
const { completeTest, updateProgress, resetTest, getTest } = useTests()

const TEST_ID = 1 // ID теста травматологии

const testInfo = ref({
  categoryKey: 'tests.traumatology',
  titleKey: 'tests.traumatologyBasic',
  descriptionKey: 'tests.traumatologyBasicDesc'
})

const questions = ref([
  { text: 'Какое исследование является "золотым стандартом" для диагностики повреждений менисков?', options: ['Рентгенография', 'УЗИ', 'МРТ', 'Артроскопия'], correct: 2 },
  { text: 'Какой симптом характерен для повреждения передней крестообразной связки?', options: ['Симптом Лассега', 'Симптом "переднего выдвижного ящика"', 'Симптом Тренделенбурга', 'Симптом Мак-Мюррея'], correct: 1 },
  { text: 'Какая степень растяжения связок характеризуется полным разрывом?', options: ['I степень', 'II степень', 'III степень', 'IV степень'], correct: 2 },
  { text: 'Какое лечение рекомендуется при полном разрыве ахиллова сухожилия у спортсмена?', options: ['Консервативное (гипс)', 'Хирургическое', 'Физиотерапия', 'Наложение тейпов'], correct: 1 },
  { text: 'Какой срок иммобилизации рекомендуется при переломе лодыжки без смещения?', options: ['1-2 недели', '3-4 недели', '6-8 недель', '10-12 недель'], correct: 2 }
])

const answers = ref([])
const currentQuestionIndex = ref(0)
const selectedOption = ref(null)
const isCompleted = ref(false)

const currentQuestion = computed(() => questions.value[currentQuestionIndex.value])

const progress = computed(() => {
  return Math.round(((currentQuestionIndex.value + (selectedOption.value !== null ? 1 : 0)) / questions.value.length) * 100)
})

const score = computed(() => {
  return answers.value.filter((ans, idx) => ans === questions.value[idx].correct).length
})

const percentage = computed(() => {
  return Math.round((score.value / questions.value.length) * 100)
})

const resultIcon = computed(() => {
  if (percentage.value >= 80) return '🎉'
  if (percentage.value >= 60) return '👍'
  return '📚'
})

const nextQuestion = () => {
  if (selectedOption.value !== null) {
    answers.value[currentQuestionIndex.value] = selectedOption.value
    
    if (currentQuestionIndex.value < questions.value.length - 1) {
      currentQuestionIndex.value++
      selectedOption.value = null
      updateProgress(TEST_ID, currentQuestionIndex.value, questions.value.length)
    } else {
      isCompleted.value = true
      completeTest(TEST_ID, score.value, questions.value.length)
      addNotification(`${t('tests.testCompleted')}: ${percentage.value}%`, 'success')
    }
  }
}

const prevQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
    selectedOption.value = answers.value[currentQuestionIndex.value] ?? null
  }
}

const restartTest = () => {
  resetTest(TEST_ID)
  answers.value = []
  currentQuestionIndex.value = 0
  selectedOption.value = null
  isCompleted.value = false
}

const goBack = () => {
  router.push('/')
}

useHead({
  title: `${t(testInfo.value.titleKey)} - MedSkills`
})
</script>

<style scoped>
.test-passing-page { min-height: 100vh; background: var(--bg-primary); padding: 20px; }
.container { max-width: 800px; margin: 0 auto; }
.test-header { margin-bottom: 30px; }
.back-btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; background: var(--bg-secondary); border: var(--border-width) solid var(--border-color); border-radius: 8px; font-size: 14px; font-weight: 600; color: #3b82f6; cursor: pointer; margin-bottom: 20px; }
.test-info { text-align: center; }
.category-badge { display: inline-block; padding: 4px 16px; background: var(--bg-unread); color: #3b82f6; border-radius: 20px; font-size: 14px; font-weight: 600; margin-bottom: 16px; }
.test-info h1 { font-size: 28px; font-weight: 700; color: var(--text-primary); margin-bottom: 8px; }
.test-info p { font-size: 16px; color: var(--text-secondary); }
.test-content { background: var(--bg-secondary); border-radius: 24px; padding: 32px; box-shadow: var(--card-shadow); border: var(--border-width) solid var(--border-color); }
.progress-section { margin-bottom: 32px; }
.progress-header { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; color: var(--text-secondary); }
.progress-bar { height: 8px; background: var(--border-color); border-radius: 4px; overflow: hidden; }
.progress-fill { height: 100%; background: linear-gradient(90deg, #3b82f6 0%, #667eea 100%); border-radius: 4px; transition: width 0.3s; }
.question-section h2 { font-size: 22px; font-weight: 600; color: var(--text-primary); margin-bottom: 24px; }
.options-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 32px; }
.option-item { display: flex; align-items: center; gap: 12px; padding: 16px 20px; background: var(--bg-hover); border: var(--border-width) solid var(--border-color); border-radius: 12px; cursor: pointer; transition: all 0.2s; }
.option-item:hover { background: var(--bg-unread); }
.option-item.selected { background: #dbeafe; border-color: #3b82f6; }
.dark .option-item.selected { background: #1e3a5f; border-color: #60a5fa; }
.option-item input { width: 20px; height: 20px; cursor: pointer; }
.option-text { font-size: 16px; color: var(--text-primary); }
.question-actions { display: flex; gap: 12px; justify-content: flex-end; }
.result-section { text-align: center; padding: 20px 0; }
.result-card { max-width: 400px; margin: 0 auto; }
.result-icon { font-size: 80px; margin-bottom: 20px; }
.result-card h2 { font-size: 24px; font-weight: 700; color: var(--text-primary); margin-bottom: 16px; }
.result-score { font-size: 48px; font-weight: 700; color: #3b82f6; margin-bottom: 8px; }
.result-percentage { font-size: 18px; color: var(--text-secondary); margin-bottom: 32px; }
.result-actions { display: flex; gap: 12px; justify-content: center; }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
</style>