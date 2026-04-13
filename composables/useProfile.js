// composables/useProfile.js
import { ref } from 'vue'

const defaultProfile = {
  name: 'Лятохов Глеб Игоревич',
  email: 'MedSkills@admin.com',
  phone: '+7 (950) 000-00-00',
  specialization: 'Администратор',
  birthDate: '17.01.2005',
  experience: '1 год'
}

const profile = ref({
  ...defaultProfile,
  shortName: 'Глеб'
})

export const useProfile = () => {
  const loadProfile = () => {
    if (!process.client) return
    
    const saved = localStorage.getItem('medskills_profile')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        profile.value = { 
          ...defaultProfile,
          ...parsed,
          shortName: parsed.shortName || `Админ. ${parsed.name?.split(' ')[0] || 'Лятохов'}`
        }
      } catch (e) {
        console.error('Error loading profile')
      }
    } else {
      profile.value = {
        ...defaultProfile,
        shortName: 'Админ. Лятохов'
      }
    }
  }
  
  const saveProfile = (data) => {
    profile.value = { 
      ...profile.value, 
      ...data
    }
    const firstName = profile.value.name.split(' ')[0]
    profile.value.shortName = `Админ. ${firstName}`
    
    if (process.client) {
      localStorage.setItem('medskills_profile', JSON.stringify(profile.value))
    }
  }
  
  return {
    profile,
    loadProfile,
    saveProfile
  }
}