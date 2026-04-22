export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  vite: {
    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit',
        'vue-i18n'
      ]
    }
  },
  
  css: [
    '~/assets/css/main.css',
    'flag-icons/css/flag-icons.min.css'
  ],
  
  app: {
    head: {
      title: 'MedSkills',
      meta: [
        { name: 'description', content: 'Приложение для спортивного врачевания' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      link: [
        { 
          rel: 'stylesheet', 
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' 
        },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'shortcut icon', href: '/favicon.ico' }
      ]
    }
  },
  
  ssr: false
})