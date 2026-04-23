import { ref } from 'vue'
import { DEFAULT_TESTS } from '~/constants/tests'

const tests = ref([])

export const useTests = () => {
  const loadTests = () => {
    if (process.client) {
      const saved = localStorage.getItem('medskills_tests')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          if (Array.isArray(parsed) && parsed.length === DEFAULT_TESTS.length) {
            tests.value = parsed
          } else {
            tests.value = JSON.parse(JSON.stringify(DEFAULT_TESTS))
          }
        } catch (e) {
          tests.value = JSON.parse(JSON.stringify(DEFAULT_TESTS))
        }
      } else {
        tests.value = JSON.parse(JSON.stringify(DEFAULT_TESTS))
      }
    }
  }

  const saveTests = () => {
    if (process.client) {
      localStorage.setItem('medskills_tests', JSON.stringify(tests.value))
    }
  }

  const getTest = (id) => {
    if (!id || typeof id !== 'number') return null
    return tests.value.find(t => t.id === id) || null
  }

  const completeTest = (testId, score, totalQuestions) => {
    if (!testId || score === undefined || !totalQuestions || totalQuestions <= 0) return false
    
    const test = tests.value.find(t => t.id === testId)
    if (test) {
      const percentage = Math.min(100, Math.max(0, Math.round((score / totalQuestions) * 100)))
      test.status = 'completed'
      test.progress = 100
      test.score = percentage
      test.completedDate = new Date().toISOString().split('T')[0]
      test.currentQuestion = 0
      test.answers = []
      saveTests()
      return true
    }
    return false
  }

  const startTest = (testId) => {
    if (!testId) return false
    
    const test = tests.value.find(t => t.id === testId)
    if (test && test.status === 'new') {
      test.status = 'continue'
      test.progress = 0
      test.currentQuestion = 0
      test.answers = []
      saveTests()
      return true
    }
    return false
  }

  const saveProgress = (testId, currentQuestion, answers, totalQuestions) => {
    if (!testId || !Array.isArray(answers) || !totalQuestions || totalQuestions <= 0) return false
    
    const test = tests.value.find(t => t.id === testId)
    if (test && test.status === 'continue') {
      test.currentQuestion = Math.min(currentQuestion, totalQuestions - 1)
      test.answers = [...answers]
      test.progress = Math.min(100, Math.round((currentQuestion / totalQuestions) * 100))
      saveTests()
      return true
    }
    return false
  }

  const resetTest = (testId) => {
    if (!testId) return false
    
    const test = tests.value.find(t => t.id === testId)
    if (test) {
      test.status = 'new'
      test.progress = null
      test.score = null
      test.completedDate = null
      test.currentQuestion = 0
      test.answers = []
      saveTests()
      return true
    }
    return false
  }

  const resetAllTests = () => {
    tests.value = JSON.parse(JSON.stringify(DEFAULT_TESTS))
    saveTests()
  }

  loadTests()

  return {
    tests,
    loadTests,
    getTest,
    completeTest,
    startTest,
    saveProgress,
    resetTest,
    resetAllTests
  }
}