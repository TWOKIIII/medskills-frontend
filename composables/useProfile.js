import { ref } from 'vue'
import { useAuth } from './useAuth'

const defaultProfile = {
  name: '',
  email: '',
  phone: '',
  specialization: '',
  birthDate: '',
  experience: '',
  shortName: ''
}

const profile = ref({ ...defaultProfile })

export const useProfile = () => {
  const { user } = useAuth()
  
  const validateName = (name) => {
    if (!name || name.trim().length < 3) {
      return { valid: false, error: 'validation.nameMinLength' }
    }
    const nameParts = name.trim().split(/\s+/)
    if (nameParts.length < 2) {
      return { valid: false, error: 'validation.nameRequiresSurname' }
    }
    return { valid: true, error: null }
  }

  const validateEmail = (email) => {
    if (!email || email.trim().length === 0) {
      return { valid: false, error: 'validation.emailRequired' }
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return { valid: false, error: 'validation.emailInvalid' }
    }
    return { valid: true, error: null }
  }

  const validatePhone = (phone) => {
    if (!phone || phone.trim().length === 0) {
      return { valid: false, error: 'validation.phoneRequired' }
    }
    const phoneRegex = /^\+?[0-9\s\-()]{10,20}$/
    if (!phoneRegex.test(phone)) {
      return { valid: false, error: 'validation.phoneInvalid' }
    }
    return { valid: true, error: null }
  }

  const validateSpecialization = (specialization) => {
    if (!specialization || specialization.trim().length === 0) {
      return { valid: false, error: 'validation.specializationRequired' }
    }
    return { valid: true, error: null }
  }

  const validateProfile = (data) => {
    const nameValidation = validateName(data.name)
    if (!nameValidation.valid) return nameValidation
    
    const emailValidation = validateEmail(data.email)
    if (!emailValidation.valid) return emailValidation
    
    const phoneValidation = validatePhone(data.phone)
    if (!phoneValidation.valid) return phoneValidation
    
    const specializationValidation = validateSpecialization(data.specialization)
    if (!specializationValidation.valid) return specializationValidation
    
    return { valid: true, error: null }
  }

  const loadProfile = () => {
    if (!process.client) return
    
    const saved = localStorage.getItem('medskills_profile')
    
    if (user.value) {
      const userRole = user.value.role === 'admin' ? 'Администратор' : 'Медицинский работник'
      
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          if (parsed.email === user.value.email) {
            profile.value = { 
              ...defaultProfile, 
              ...parsed,
              specialization: parsed.specialization || userRole
            }
          } else {
            profile.value = {
              ...defaultProfile,
              email: user.value.email,
              name: user.value.name || '',
              shortName: user.value.name ? user.value.name.split(' ')[0] : '',
              specialization: userRole
            }
          }
        } catch (e) {
          profile.value = {
            ...defaultProfile,
            email: user.value.email,
            name: user.value.name || '',
            shortName: user.value.name ? user.value.name.split(' ')[0] : '',
            specialization: userRole
          }
        }
      } else {
        profile.value = {
          ...defaultProfile,
          email: user.value.email,
          name: user.value.name || '',
          shortName: user.value.name ? user.value.name.split(' ')[0] : '',
          specialization: userRole
        }
      }
    } else {
      profile.value = { ...defaultProfile }
    }
  }
  
  const saveProfile = (data) => {
    const validation = validateProfile(data)
    if (!validation.valid) {
      return { success: false, error: validation.error }
    }
    
    profile.value = { ...profile.value, ...data }
    const nameParts = profile.value.name.trim().split(/\s+/)
    const firstName = nameParts[1] || nameParts[0]
    profile.value.shortName = firstName
    
    if (process.client) {
      localStorage.setItem('medskills_profile', JSON.stringify(profile.value))
    }
    
    return { success: true, error: null }
  }

  const resetProfile = () => {
    profile.value = { ...defaultProfile }
    if (process.client) {
      localStorage.setItem('medskills_profile', JSON.stringify(defaultProfile))
    }
  }
  
  const syncWithUser = () => {
    if (user.value) {
      const userRole = user.value.role === 'admin' ? 'Администратор' : 'Медицинский работник'
      profile.value.email = user.value.email
      profile.value.name = user.value.name || profile.value.name
      profile.value.shortName = user.value.name ? user.value.name.split(' ')[0] : profile.value.shortName
      if (!profile.value.specialization) {
        profile.value.specialization = userRole
      }
    }
  }
  
  return {
    profile,
    loadProfile,
    saveProfile,
    resetProfile,
    validateName,
    validateEmail,
    validatePhone,
    syncWithUser
  }
}