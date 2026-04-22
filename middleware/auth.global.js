export default defineNuxtRouteMiddleware((to) => {
  const publicPages = ['/login', '/register', '/reset-password']
  
  if (process.client) {
    const auth = localStorage.getItem('medskills_auth')
    const isAuthenticated = auth ? JSON.parse(auth).isAuthenticated : false
    
    if (!isAuthenticated && !publicPages.includes(to.path)) {
      return navigateTo('/login')
    }
    
    if (isAuthenticated && publicPages.includes(to.path)) {
      return navigateTo('/')
    }
  }
})