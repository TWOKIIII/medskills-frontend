<template>
  <div class="test-card fade-in" :style="{ animationDelay: `${index * 0.05}s` }">
    <div class="card-content">
      <div class="card-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM10 4h4v2h-4V4z" :fill="iconColor"/>
        </svg>
      </div>
      <div class="card-info">
        <h3>{{ title }}</h3>
        <p class="description">{{ description }}</p>
        <div v-if="progress" class="progress-bar">
          <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
        </div>
      </div>
    </div>
    <div class="card-action">
      <button :class="buttonClass" @click="handleAction">
        {{ buttonText }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Название теста'
  },
  description: {
    type: String,
    default: 'Описание'
  },
  status: {
    type: String,
    default: 'new', // 'new', 'continue', 'completed'
    validator: (value) => ['new', 'continue', 'completed'].includes(value)
  },
  progress: {
    type: Number,
    default: null
  },
  index: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['action'])

const buttonText = computed(() => {
  switch (props.status) {
    case 'continue':
      return 'Продолжить'
    case 'completed':
      return 'Пройти снова'
    default:
      return 'Пройти'
  }
})

const buttonClass = computed(() => {
  switch (props.status) {
    case 'continue':
      return 'btn btn-continue'
    case 'completed':
      return 'btn btn-retake'
    default:
      return 'btn btn-start'
  }
})

const iconColor = computed(() => {
  switch (props.status) {
    case 'continue':
      return '#3b82f6'
    case 'completed':
      return '#f59e0b'
    default:
      return '#10b981'
  }
})

const handleAction = () => {
  emit('action', { title: props.title, status: props.status })
}
</script>

<style scoped>
.test-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.2s;
  opacity: 0;
  animation: fadeIn 0.3s ease-out forwards;
}

.test-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.card-content {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  flex: 1;
}

.card-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.card-info {
  flex: 1;
}

.card-info h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
}

.description {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 8px;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6 0%, #667eea 100%);
  border-radius: 2px;
  transition: width 0.3s;
}

.card-action {
  flex-shrink: 0;
  margin-left: 16px;
}

.btn {
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 110px;
  text-align: center;
}

.btn-continue {
  background: #3b82f6;
  color: white;
}

.btn-continue:hover {
  background: #2563eb;
  transform: scale(1.02);
}

.btn-start {
  background: #10b981;
  color: white;
}

.btn-start:hover {
  background: #059669;
  transform: scale(1.02);
}

.btn-retake {
  background: #f59e0b;
  color: white;
}

.btn-retake:hover {
  background: #d97706;
  transform: scale(1.02);
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}
</style>