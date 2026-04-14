import { ref } from 'vue'

const defaultTests = [
  { id: 1, category: 'traumatology', categoryKey: 'tests.traumatology', titleKey: 'tests.traumatologyBasic', descriptionKey: 'tests.traumatologyBasicDesc', status: 'new', progress: null, score: null, completedDate: null, currentQuestion: 0, answers: [] },
  { id: 2, category: 'traumatology', categoryKey: 'tests.traumatology', titleKey: 'tests.traumatologyJoints', descriptionKey: 'tests.traumatologyJointsDesc', status: 'new', progress: null, score: null, completedDate: null, currentQuestion: 0, answers: [] },
  { id: 3, category: 'traumatology', categoryKey: 'tests.traumatology', titleKey: 'tests.traumatologySpine', descriptionKey: 'tests.traumatologySpineDesc', status: 'new', progress: null, score: null, completedDate: null, currentQuestion: 0, answers: [] },
  
  { id: 4, category: 'cardiology', categoryKey: 'tests.cardiology', titleKey: 'tests.cardiologyBasic', descriptionKey: 'tests.cardiologyBasicDesc', status: 'new', progress: null, score: null, completedDate: null, currentQuestion: 0, answers: [] },
  { id: 5, category: 'cardiology', categoryKey: 'tests.cardiology', titleKey: 'tests.cardiologyECG', descriptionKey: 'tests.cardiologyECGDesc', status: 'new', progress: null, score: null, completedDate: null, currentQuestion: 0, answers: [] },
  { id: 6, category: 'cardiology', categoryKey: 'tests.cardiology', titleKey: 'tests.cardiologyStress', descriptionKey: 'tests.cardiologyStressDesc', status: 'new', progress: null, score: null, completedDate: null, currentQuestion: 0, answers: [] },

  { id: 7, category: 'rehabilitation', categoryKey: 'tests.rehabilitation', titleKey: 'tests.rehabilitationBasic', descriptionKey: 'tests.rehabilitationBasicDesc', status: 'new', progress: null, score: null, completedDate: null, currentQuestion: 0, answers: [] },
  { id: 8, category: 'rehabilitation', categoryKey: 'tests.rehabilitation', titleKey: 'tests.rehabilitationPostOp', descriptionKey: 'tests.rehabilitationPostOpDesc', status: 'new', progress: null, score: null, completedDate: null, currentQuestion: 0, answers: [] },
  { id: 9, category: 'rehabilitation', categoryKey: 'tests.rehabilitation', titleKey: 'tests.rehabilitationSports', descriptionKey: 'tests.rehabilitationSportsDesc', status: 'new', progress: null, score: null, completedDate: null, currentQuestion: 0, answers: [] },
  
  { id: 10, category: 'nutrition', categoryKey: 'tests.nutrition', titleKey: 'tests.nutritionBasic', descriptionKey: 'tests.nutritionBasicDesc', status: 'new', progress: null, score: null, completedDate: null, currentQuestion: 0, answers: [] },
  { id: 11, category: 'nutrition', categoryKey: 'tests.nutrition', titleKey: 'tests.nutritionCompetition', descriptionKey: 'tests.nutritionCompetitionDesc', status: 'new', progress: null, score: null, completedDate: null, currentQuestion: 0, answers: [] },
  { id: 12, category: 'nutrition', categoryKey: 'tests.nutrition', titleKey: 'tests.nutritionRecovery', descriptionKey: 'tests.nutritionRecoveryDesc', status: 'new', progress: null, score: null, completedDate: null, currentQuestion: 0, answers: [] }
]

const tests = ref([])

export const useTests = () => {
  const loadTests = () => {
    if (process.client) {
      const saved = localStorage.getItem('medskills_tests')
      if (saved) {
        try {
          tests.value = JSON.parse(saved)
        } catch (e) {
          tests.value = JSON.parse(JSON.stringify(defaultTests))
        }
      } else {
        tests.value = JSON.parse(JSON.stringify(defaultTests))
      }
    }
  }

  const saveTests = () => {
    if (process.client) {
      localStorage.setItem('medskills_tests', JSON.stringify(tests.value))
    }
  }

  const getTest = (id) => {
    return tests.value.find(t => t.id === id)
  }

  const completeTest = (testId, score, totalQuestions) => {
    const test = tests.value.find(t => t.id === testId)
    if (test) {
      const percentage = Math.round((score / totalQuestions) * 100)
      test.status = 'completed'
      test.progress = 100
      test.score = percentage
      test.completedDate = new Date().toISOString().split('T')[0]
      test.currentQuestion = 0
      test.answers = []
      saveTests()
    }
  }

  const startTest = (testId) => {
    const test = tests.value.find(t => t.id === testId)
    if (test && test.status === 'new') {
      test.status = 'continue'
      test.progress = 0
      test.currentQuestion = 0
      test.answers = []
      saveTests()
    }
  }

  const saveProgress = (testId, currentQuestion, answers, totalQuestions) => {
    const test = tests.value.find(t => t.id === testId)
    if (test && test.status === 'continue') {
      test.currentQuestion = currentQuestion
      test.answers = [...answers]
      test.progress = Math.round((currentQuestion / totalQuestions) * 100)
      saveTests()
    }
  }

  const resetTest = (testId) => {
    const test = tests.value.find(t => t.id === testId)
    if (test) {
      test.status = 'new'
      test.progress = null
      test.score = null
      test.completedDate = null
      test.currentQuestion = 0
      test.answers = []
      saveTests()
    }
  }

  const resetAllTests = () => {
    tests.value = JSON.parse(JSON.stringify(defaultTests))
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