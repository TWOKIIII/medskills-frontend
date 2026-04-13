// plugins/i18n.js
import { createI18n } from 'vue-i18n'

const messages = {
  ru: {
    app: {
      title: 'MedSkills',
      welcome: 'Добро пожаловать',
      tests: 'Тесты',
      statistics: 'Статистика',
      knowledge: 'База знаний',
      settings: 'Настройки',
      help: 'Помощь',
      profile: 'Профиль',
      logout: 'Выйти',
      welcomeSubtitle: 'Система тестирования для спортивных врачей'
    },
    notifications: {
      title: 'Уведомления',
      empty: 'Нет уведомлений',
      clear: 'Очистить',
      languageChanged: 'Язык изменён на Русский',
      notificationsOn: 'Уведомления включены',
      notificationsOff: 'Уведомления выключены',
      profileUpdated: 'Профиль обновлён'
    },
    profile: {
      title: 'Профиль',
      edit: 'Редактировать',
      save: 'Сохранить',
      cancel: 'Отмена',
      name: 'ФИО',
      email: 'Email',
      phone: 'Телефон',
      specialization: 'Роль',
      birthDate: 'Дата рождения',
      experience: 'Стаж работы',
      personalInfo: 'Личная информация'
    },
    settings: {
      title: 'Настройки',
      notifications: 'Уведомления',
      notificationsDesc: 'Получать уведомления о тестах и обновлениях',
      language: 'Язык',
      languageDesc: 'Выберите язык интерфейса'
    },
    tests: {
      title: 'Тесты',
      subtitle: 'Спортивная медицина',
      continue: 'Продолжить',
      start: 'Пройти',
      retake: 'Пройти снова',
      completed: 'Завершено',
      inProgress: 'В процессе',
      new: 'Новый',
      traumatology: 'Травматология спортивная',
      traumatologyDesc: 'Диагностика и лечение спортивных травм',
      rehabilitation: 'Реабилитация после травм',
      rehabilitationDesc: 'Методы восстановления спортсменов',
      cardiology: 'Спортивная кардиология',
      cardiologyDesc: 'Оценка состояния сердечно-сосудистой системы',
      pharmacology: 'Фармакология в спорте',
      pharmacologyDesc: 'Применение лекарственных средств',
      nutrition: 'Питание спортсменов',
      nutritionDesc: 'Основы спортивной диетологии',
      biomechanics: 'Биомеханика движений',
      biomechanicsDesc: 'Анализ техники выполнения упражнений',
      doping: 'Допинг-контроль',
      dopingDesc: 'Антидопинговые правила и процедуры'
    },
    doctor: {
      specialization: 'Администратор',
      specializationDesc: 'Управление системой тестирования',
      stats: 'Статистика',
      testsPassed: 'Пройдено тестов',
      averageScore: 'Средний балл',
      inProgress: 'В процессе',
      hoursLearning: 'Часов обучения'
    },
    recommendations: {
      title: 'Рекомендации',
      item1: 'Пройдите тест по спортивной кардиологии',
      item2: 'Обновите знания по реабилитации',
      item3: 'Новый курс: "Питание спортсменов"'
    },
    help: {
      title: 'Помощь и поддержка',
      subtitle: 'Часто задаваемые вопросы и руководства',
      faq: 'Часто задаваемые вопросы',
      contacts: 'Контакты',
      documentation: 'Документация',
      support: 'Техническая поддержка',
      q1: 'Как начать тестирование?',
      a1: 'Выберите нужный тест из списка на главной странице и нажмите кнопку "Пройти".',
      q2: 'Как посмотреть результаты?',
      a2: 'Результаты тестов доступны в разделе "Статистика".',
      q3: 'Как изменить личные данные?',
      a3: 'Перейдите в раздел "Профиль" и нажмите кнопку "Редактировать".',
      q4: 'Как связаться с поддержкой?',
      a4: 'Используйте контакты ниже или напишите на email поддержки.',
      contactPhone: 'Телефон поддержки',
      contactEmail: 'Email поддержки',
      contactHours: 'Часы работы',
      hours: 'Пн-Пт: 10:00 - 17:00',
      address: 'Адрес',
      addressText: 'г. Иркутск, ул. Советская',
    }
  },
  en: {
    app: {
      title: 'MedSkills',
      welcome: 'Welcome',
      tests: 'Tests',
      statistics: 'Statistics',
      knowledge: 'Knowledge Base',
      settings: 'Settings',
      help: 'Help',
      profile: 'Profile',
      logout: 'Logout',
      welcomeSubtitle: 'Testing system for sports medicine doctors'
    },
    notifications: {
      title: 'Notifications',
      empty: 'No notifications',
      clear: 'Clear',
      languageChanged: 'Language changed to English',
      notificationsOn: 'Notifications enabled',
      notificationsOff: 'Notifications disabled',
      profileUpdated: 'Profile updated'
    },
    profile: {
      title: 'Profile',
      edit: 'Edit',
      save: 'Save',
      cancel: 'Cancel',
      name: 'Full Name',
      email: 'Email',
      phone: 'Phone',
      specialization: 'Role',
      birthDate: 'Birth Date',
      experience: 'Experience',
      personalInfo: 'Personal Information'
    },
    settings: {
      title: 'Settings',
      notifications: 'Notifications',
      notificationsDesc: 'Receive notifications about tests and updates',
      language: 'Language',
      languageDesc: 'Choose interface language'
    },
    tests: {
      title: 'Tests',
      subtitle: 'Sports Medicine',
      continue: 'Continue',
      start: 'Start',
      retake: 'Retake',
      completed: 'Completed',
      inProgress: 'In Progress',
      new: 'New',
      traumatology: 'Sports Traumatology',
      traumatologyDesc: 'Diagnosis and treatment of sports injuries',
      rehabilitation: 'Post-injury Rehabilitation',
      rehabilitationDesc: 'Athlete recovery methods',
      cardiology: 'Sports Cardiology',
      cardiologyDesc: 'Cardiovascular system assessment',
      pharmacology: 'Sports Pharmacology',
      pharmacologyDesc: 'Use of medications',
      nutrition: 'Athlete Nutrition',
      nutritionDesc: 'Fundamentals of sports dietetics',
      biomechanics: 'Movement Biomechanics',
      biomechanicsDesc: 'Exercise technique analysis',
      doping: 'Doping Control',
      dopingDesc: 'Anti-doping rules and procedures'
    },
    doctor: {
      specialization: 'Administrator',
      specializationDesc: 'Testing system management',
      stats: 'Statistics',
      testsPassed: 'Tests passed',
      averageScore: 'Average score',
      inProgress: 'In progress',
      hoursLearning: 'Learning hours'
    },
    recommendations: {
      title: 'Recommendations',
      item1: 'Take the sports cardiology test',
      item2: 'Update rehabilitation knowledge',
      item3: 'New course: "Athlete Nutrition"'
    },
    help: {
      title: 'Help & Support',
      subtitle: 'Frequently asked questions and guides',
      faq: 'Frequently Asked Questions',
      contacts: 'Contacts',
      documentation: 'Documentation',
      support: 'Technical Support',
      q1: 'How to start testing?',
      a1: 'Select the desired test from the list on the main page and click "Start".',
      q2: 'How to view results?',
      a2: 'Test results are available in the "Statistics" section.',
      q3: 'How to change personal data?',
      a3: 'Go to the "Profile" section and click the "Edit" button.',
      q4: 'How to contact support?',
      a4: 'Use the contacts below or write to support email.',
      contactPhone: 'Support Phone',
      contactEmail: 'Support Email',
      contactHours: 'Working Hours',
      hours: 'Mon-Fri: 10:00 - 17:00',
      address: 'Address',
      addressText: 'Irkutsk, Sovetskaya str.',
    }
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  const i18n = createI18n({
    legacy: false,
    locale: 'ru',
    fallbackLocale: 'ru',
    messages
  })
  
  nuxtApp.vueApp.use(i18n)
  
  return {
    provide: {
      i18n
    }
  }
})