// composables/useNotifications.js
import { ref, computed } from 'vue'

const notifications = ref([])
const snackbar = ref({
  show: false,
  message: '',
  color: 'info'
})

export const useNotifications = () => {
  const addNotification = (message, color = 'info') => {
    const id = Date.now() + Math.random()
    
    notifications.value.unshift({
      id,
      message,
      color,
      timestamp: Date.now(),
      read: false
    })
    
    snackbar.value = {
      show: true,
      message,
      color
    }
    
    setTimeout(() => {
      snackbar.value.show = false
    }, 3000)
  }
  
  const markAsRead = (id) => {
    const notification = notifications.value.find(n => n.id === id)
    if (notification) notification.read = true
  }
  
  const clearAll = () => {
    notifications.value = []
  }
  
  const unreadCount = computed(() => 
    notifications.value.filter(n => !n.read).length
  )
  
  return {
    notifications,
    snackbar,
    addNotification,
    markAsRead,
    clearAll,
    unreadCount
  }
}