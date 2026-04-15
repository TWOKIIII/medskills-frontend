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
    const nameParts = profile.value.name.split(' ')
    const firstName = nameParts[1] || nameParts[0]  // "Глеб"
    profile.value.shortName = firstName 
    
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