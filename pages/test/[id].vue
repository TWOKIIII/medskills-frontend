<template>
  <div class="test-passing-page">
    <div class="container">
      <AppHeader />
      
      <div class="test-header">
        <button class="back-btn" @click="goBack">
          <span>←</span> {{ t('tests.backToTests') }}
        </button>
        <div class="test-info" v-if="testData">
          <span class="category-badge">{{ t(testData.categoryKey) }}</span>
          <h1>{{ t(testData.titleKey) }}</h1>
          <p>{{ t(testData.descriptionKey) }}</p>
        </div>
      </div>
      
      <div class="test-content" v-if="testData">
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
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useNotifications } from '~/composables/useNotifications'
import { useTests } from '~/composables/useTests'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const { addNotification } = useNotifications()
const { getTest, completeTest, saveProgress, resetTest } = useTests()

const testId = parseInt(route.params.id)
const testData = ref(null)
const questions = ref([])
const answers = ref([])
const currentQuestionIndex = ref(0)
const selectedOption = ref(null)
const isCompleted = ref(false)

// Данные вопросов для разных тестов
const questionsData = {
  // Травматология
  1: [ // traumatologyBasic
    { text: 'Какое исследование является "золотым стандартом" для диагностики повреждений менисков?', options: ['Рентгенография', 'УЗИ', 'МРТ', 'Артроскопия'], correct: 2 },
    { text: 'Какой симптом характерен для повреждения передней крестообразной связки?', options: ['Симптом Лассега', 'Симптом "переднего выдвижного ящика"', 'Симптом Тренделенбурга', 'Симптом Мак-Мюррея'], correct: 1 },
    { text: 'Какая степень растяжения связок характеризуется полным разрывом?', options: ['I степень', 'II степень', 'III степень', 'IV степень'], correct: 2 },
    { text: 'Какое лечение рекомендуется при полном разрыве ахиллова сухожилия у спортсмена?', options: ['Консервативное (гипс)', 'Хирургическое', 'Физиотерапия', 'Наложение тейпов'], correct: 1 },
    { text: 'Какой срок иммобилизации рекомендуется при переломе лодыжки без смещения?', options: ['1-2 недели', '3-4 недели', '6-8 недель', '10-12 недель'], correct: 2 }
  ],
  // Добавь вопросы для остальных ID тестов (2-12)
  2: [ { text: 'Вопрос 1 для теста 2', options: ['A', 'B', 'C', 'D'], correct: 0 }, { text: 'Вопрос 2', options: ['A', 'B', 'C', 'D'], correct: 1 }, { text: 'Вопрос 3', options: ['A', 'B', 'C', 'D'], correct: 2 } ],
  3: [ { text: 'Вопрос 1 для теста 3', options: ['A', 'B', 'C', 'D'], correct: 0 }, { text: 'Вопрос 2', options: ['A', 'B', 'C', 'D'], correct: 1 }, { text: 'Вопрос 3', options: ['A', 'B', 'C', 'D'], correct: 2 } ],
  4: [ { text: 'Какая частота сердечных сокращений считается брадикардией у спортсменов?', options: ['Менее 40 уд/мин', 'Менее 50 уд/мин', 'Менее 60 уд/мин', 'Менее 70 уд/мин'], correct: 0 }, { text: 'Какой метод обязателен для кардиологического скрининга?', options: ['ЭКГ', 'ЭхоКГ', 'Холтер', 'Все'], correct: 3 }, { text: 'Что характерно для "спортивного сердца"?', options: ['Брадикардия', 'Гипертрофия', 'Высокий вольтаж', 'Всё'], correct: 3 } ],
  5: [ { text: 'Вопрос 1 для теста 5', options: ['A', 'B', 'C', 'D'], correct: 0 }, { text: 'Вопрос 2', options: ['A', 'B', 'C', 'D'], correct: 1 }, { text: 'Вопрос 3', options: ['A', 'B', 'C', 'D'], correct: 2 } ],
  6: [ { text: 'Вопрос 1 для теста 6', options: ['A', 'B', 'C', 'D'], correct: 0 }, { text: 'Вопрос 2', options: ['A', 'B', 'C', 'D'], correct: 1 }, { text: 'Вопрос 3', options: ['A', 'B', 'C', 'D'], correct: 2 } ],
  7: [ { text: 'Какой этап реабилитации первый?', options: ['Иммобилизация', 'ЛФК', 'Массаж', 'Физиотерапия'], correct: 0 }, { text: 'Когда начинать активную реабилитацию?', options: ['Сразу', 'После снятия боли', 'После сращения', 'Через месяц'], correct: 1 }, { text: 'Что важно при реабилитации?', options: ['Постепенность', 'Индивидуальность', 'Комплексность', 'Всё'], correct: 3 } ],
  8: [ { text: 'Вопрос 1 для теста 8', options: ['A', 'B', 'C', 'D'], correct: 0 }, { text: 'Вопрос 2', options: ['A', 'B', 'C', 'D'], correct: 1 }, { text: 'Вопрос 3', options: ['A', 'B', 'C', 'D'], correct: 2 } ],
  9: [ { text: 'Вопрос 1 для теста 9', options: ['A', 'B', 'C', 'D'], correct: 0 }, { text: 'Вопрос 2', options: ['A', 'B', 'C', 'D'], correct: 1 }, { text: 'Вопрос 3', options: ['A', 'B', 'C', 'D'], correct: 2 } ],
  10: [ { text: 'Какое соотношение БЖУ рекомендуется спортсменам?', options: ['30/30/40', '20/30/50', '40/30/30', '50/20/30'], correct: 0 }, { text: 'Когда лучше есть перед тренировкой?', options: ['За 3-4 часа', 'За 1-2 часа', 'За 30 мин', 'Не есть'], correct: 1 }, { text: 'Что важно для восстановления?', options: ['Белок', 'Углеводы', 'Вода', 'Всё'], correct: 3 } ],
  11: [ { text: 'Вопрос 1 для теста 11', options: ['A', 'B', 'C', 'D'], correct: 0 }, { text: 'Вопрос 2', options: ['A', 'B', 'C', 'D'], correct: 1 }, { text: 'Вопрос 3', options: ['A', 'B', 'C', 'D'], correct: 2 } ],
  12: [ { text: 'Вопрос 1 для теста 12', options: ['A', 'B', 'C', 'D'], correct: 0 }, { text: 'Вопрос 2', options: ['A', 'B', 'C', 'D'], correct: 1 }, { text: 'Вопрос 3', options: ['A', 'B', 'C', 'D'], correct: 2 } ]
}

const currentQuestion = computed(() => questions.value[currentQuestionIndex.value])

const progress = computed(() => {
  return Math.round(((currentQuestionIndex.value + (selectedOption.value !== null ? 1 : 0)) / questions.value.length) * 100)
})

const score = computed(() => {
  return answers.value.filter((ans, idx) => ans === questions.value[idx]?.correct).length
})

const percentage = computed(() => {
  return Math.round((score.value / questions.value.length) * 100)
})

const resultIcon = computed(() => {
  if (percentage.value >= 80) return '🎉'
  if (percentage.value >= 60) return '👍'
  return '📚'
})

const loadTest = () => {
  const test = getTest(testId)
  if (test) {
    testData.value = test
    questions.value = questionsData[testId] || questionsData[1]
    
    if (test.status === 'completed') {
      isCompleted.value = true
    } else if (test.status === 'continue' && test.currentQuestion > 0) {
      // Восстанавливаем прогресс
      currentQuestionIndex.value = test.currentQuestion
      answers.value = [...test.answers]
      selectedOption.value = answers.value[currentQuestionIndex.value] ?? null
    }
  } else {
    router.push('/')
  }
}

const nextQuestion = () => {
  if (selectedOption.value !== null) {
    answers.value[currentQuestionIndex.value] = selectedOption.value
    
    if (currentQuestionIndex.value < questions.value.length - 1) {
      currentQuestionIndex.value++
      selectedOption.value = answers.value[currentQuestionIndex.value] ?? null
      saveProgress(testId, currentQuestionIndex.value, answers.value, questions.value.length)
    } else {
      isCompleted.value = true
      completeTest(testId, score.value, questions.value.length)
      addNotification(`${t('tests.testCompleted')}: ${percentage.value}%`, 'success')
    }
  }
}

const prevQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
    selectedOption.value = answers.value[currentQuestionIndex.value] ?? null
    saveProgress(testId, currentQuestionIndex.value, answers.value, questions.value.length)
  }
}

const restartTest = () => {
  resetTest(testId)
  answers.value = []
  currentQuestionIndex.value = 0
  selectedOption.value = null
  isCompleted.value = false
}

const goBack = () => {
  router.push('/')
}

onMounted(() => {
  loadTest()
})

useHead({
  title: testData.value ? `${t(testData.value.titleKey)} - MedSkills` : 'Тест - MedSkills'
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