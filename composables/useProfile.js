// composables/useProfile.js
import { ref } from 'vue'

const defaultProfile = {
  name: 'Лятохов Глеб Игоревич',
  email: 'lyatokhov38@gmail.com',
  phone: '+7 (950) 082-81-11',
  specialization: 'Администратор',
  birthDate: '17.01.2005',
  experience: '21 год',
  shortName: 'Админ. Лятохов'
}

const profile = ref({ ...defaultProfile })

export const useProfile = () => {
  const loadProfile = () => {
    if (!process.client) return
    
    const saved = localStorage.getItem('medskills_profile')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        profile.value = { ...defaultProfile, ...parsed }
      } catch (e) {
        console.error('Error loading profile')
      }
    } else {
      profile.value = { ...defaultProfile }
    }
  }
  
  const saveProfile = (data) => {
    profile.value = { ...profile.value, ...data }
    const firstName = profile.value.name.split(' ')[0]
    profile.value.shortName = `Админ. ${firstName}`
    
    if (process.client) {
      localStorage.setItem('medskills_profile', JSON.stringify(profile.value))
    }
  }

  const resetProfile = () => {
    profile.value = { ...defaultProfile }
    if (process.client) {
      localStorage.setItem('medskills_profile', JSON.stringify(defaultProfile))
    }
  }
  
  return {
    profile,
    loadProfile,
    saveProfile,
    resetProfile
  }
}