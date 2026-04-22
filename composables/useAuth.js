import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useNotifications } from './useNotifications'
import { useI18n } from 'vue-i18n'

const isAuthenticated = ref(false)
const user = ref(null)

const defaultUsers = [
  { email: 'admin@test.ru', password: 'admin', name: 'Администратор', role: 'admin' }
]

export const useAuth = () => {
  const router = useRouter()
  const { addNotification } = useNotifications()
  const { t } = useI18n()

  const initAuth = () => {
    if (process.client) {
      const saved = localStorage.getItem('medskills_auth')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          isAuthenticated.value = parsed.isAuthenticated || false
          user.value = parsed.user || null
        } catch (e) {
          isAuthenticated.value = false
          user.value = null
        }
      }
      
      const users = localStorage.getItem('medskills_users')
      if (!users) {
        localStorage.setItem('medskills_users', JSON.stringify(defaultUsers))
      } else {
        const parsedUsers = JSON.parse(users)
        const hasAdmin = parsedUsers.some(u => u.email === 'admin@test.ru')
        if (!hasAdmin) {
          parsedUsers.push(defaultUsers[0])
          localStorage.setItem('medskills_users', JSON.stringify(parsedUsers))
        }
      }
    }
  }

  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const usersStr = localStorage.getItem('medskills_users') || '[]'
        const users = JSON.parse(usersStr)
        
        const foundUser = users.find(u => u.email === email && u.password === password)
        
        if (foundUser) {
          isAuthenticated.value = true
          user.value = {
            email: foundUser.email,
            name: foundUser.name,
            role: foundUser.role,
            loginTime: new Date().toISOString()
          }
          
          if (process.client) {
            localStorage.setItem('medskills_auth', JSON.stringify({
              isAuthenticated: true,
              user: user.value
            }))
          }
          
          addNotification(t('auth.loginSuccess'), 'success')
          resolve({ success: true })
        } else {
          reject({ success: false, error: t('auth.invalidCredentials') })
        }
      }, 500)
    })
  }

  const logout = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        isAuthenticated.value = false
        user.value = null
        
        if (process.client) {
          localStorage.removeItem('medskills_auth')
          localStorage.removeItem('medskills_remember')
        }
        
        addNotification(t('auth.logoutSuccess'), 'info')
        router.push('/login')
        resolve({ success: true })
      }, 300)
    })
  }

  const register = (name, email, password, confirmPassword) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!name || name.trim().length < 2) {
          reject({ success: false, error: t('auth.nameRequired') })
          return
        }
        
        if (!email || !email.includes('@')) {
          reject({ success: false, error: t('auth.invalidEmail') })
          return
        }
        
        if (!password || password.length < 6) {
          reject({ success: false, error: t('auth.passwordLength') })
          return
        }
        
        if (password !== confirmPassword) {
          reject({ success: false, error: t('auth.passwordsMismatch') })
          return
        }
        
        const usersStr = localStorage.getItem('medskills_users') || '[]'
        const users = JSON.parse(usersStr)
        
        const existingUser = users.find(u => u.email === email)
        if (existingUser) {
          reject({ success: false, error: t('auth.emailAlreadyExists') })
          return
        }
        
        const isAdminEmail = email === 'admin@test.ru'
        
        const newUser = {
          email,
          password,
          name,
          role: isAdminEmail ? 'admin' : 'user',
          registerTime: new Date().toISOString()
        }
        
        users.push(newUser)
        localStorage.setItem('medskills_users', JSON.stringify(users))
        
        isAuthenticated.value = true
        user.value = {
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          registerTime: newUser.registerTime
        }
        
        if (process.client) {
          localStorage.setItem('medskills_auth', JSON.stringify({
            isAuthenticated: true,
            user: user.value
          }))
        }
        
        addNotification(t('auth.registerSuccess'), 'success')
        resolve({ success: true })
      }, 500)
    })
  }

  const resetPassword = (email) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!email || !email.includes('@')) {
          reject({ success: false, error: t('auth.invalidEmail') })
          return
        }
        
        const usersStr = localStorage.getItem('medskills_users') || '[]'
        const users = JSON.parse(usersStr)
        
        const userIndex = users.findIndex(u => u.email === email)
        
        if (userIndex === -1) {
          reject({ success: false, error: t('auth.userNotFound') })
          return
        }
        
        users[userIndex].password = '111111'
        localStorage.setItem('medskills_users', JSON.stringify(users))
        
        addNotification(t('auth.passwordResetToDefault', { password: '111111' }), 'success')
        resolve({ success: true })
      }, 500)
    })
  }

  const updateUserProfile = (email, updates) => {
    const usersStr = localStorage.getItem('medskills_users') || '[]'
    const users = JSON.parse(usersStr)
    
    const userIndex = users.findIndex(u => u.email === email)
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates }
      localStorage.setItem('medskills_users', JSON.stringify(users))
      
      if (user.value && user.value.email === email) {
        user.value = { ...user.value, ...updates }
        localStorage.setItem('medskills_auth', JSON.stringify({
          isAuthenticated: true,
          user: user.value
        }))
      }
    }
  }

  initAuth()

  return {
    isAuthenticated,
    user,
    login,
    logout,
    register,
    resetPassword,
    updateUserProfile,
    initAuth
  }
}