// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  // Игнорируем эти предупреждения
  vite: {
    resolve: {
      dedupe: ['@nuxt/nitro-server']
    }
  },
  
  css: [
    '~/assets/css/main.css',
    'flag-icons/css/flag-icons.min.css'
  ],
  
  app: {
    head: {
      title: 'MedSkills - Спортивная медицина',
      meta: [
        { name: 'description', content: 'Приложение для спортивного врачевания' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      link: [
        { 
          rel: 'stylesheet', 
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' 
        }
      ]
    }
  }
})