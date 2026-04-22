export default defineNuxtPlugin(() => {
  const theme = localStorage.getItem('medskills_theme') || 'light'
  const html = document.documentElement
  
  if (theme === 'dark') {
    html.classList.add('dark')
  } else {
    html.classList.remove('dark')
  }
  
  const settings = localStorage.getItem('medskills_settings')
  if (settings) {
    try {
      const parsed = JSON.parse(settings)
      if (parsed.theme) {
        if (parsed.theme === 'dark') {
          html.classList.add('dark')
        } else {
          html.classList.remove('dark')
        }
      }
    } catch (e) {}
  }
})