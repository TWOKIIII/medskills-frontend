import { ref } from 'vue'

const defaultProfile = {
  name: 'Лятохов Глеб Игоревич',
  email: 'MedSkills@support.com',
  phone: '+7 (950) 000-00-00',
  specialization: 'Администратор',
  birthDate: '01.01.2000',
  experience: '1 год',
  shortName: 'Глеб'
}

const profile = ref({ ...defaultProfile })

export const useProfile = () => {
  const validateName = (name) => {
    if (!name || name.trim().length < 3) {
      return { valid: false, error: 'Имя должно содержать минимум 3 символа' }
    }
    const nameParts = name.trim().split(/\s+/)
    if (nameParts.length < 2) {
      return { valid: false, error: 'Введите фамилию и имя' }
    }
    return { valid: true, error: null }
  }

  const validateEmail = (email) => {
    if (!email || email.trim().length === 0) {
      return { valid: false, error: 'Email обязателен для заполнения' }
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return { valid: false, error: 'Введите корректный email адрес' }
    }
    return { valid: true, error: null }
  }

  const validatePhone = (phone) => {
    if (!phone || phone.trim().length === 0) {
      return { valid: false, error: 'Телефон обязателен для заполнения' }
    }
    const phoneRegex = /^\+?[0-9\s\-()]{10,20}$/
    if (!phoneRegex.test(phone)) {
      return { valid: false, error: 'Введите корректный номер телефона' }
    }
    return { valid: true, error: null }
  }

  const validateSpecialization = (specialization) => {
    if (!specialization || specialization.trim().length === 0) {
      return { valid: false, error: 'Специализация обязательна для заполнения' }
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
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        profile.value = { ...defaultProfile, ...parsed }
      } catch (e) {
        console.error('Error loading profile')
        profile.value = { ...defaultProfile }
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
  
  loadProfile()
  
  return {
    profile,
    loadProfile,
    saveProfile,
    resetProfile,
    validateName,
    validateEmail,
    validatePhone
  }
}