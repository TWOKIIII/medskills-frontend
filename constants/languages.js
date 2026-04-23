export const LANGUAGES = [
  { code: 'ru', name: 'Русский', short: 'RU', flagClass: 'fi fi-ru' },
  { code: 'en', name: 'English', short: 'EN', flagClass: 'fi fi-gb' },
  { code: 'de', name: 'Deutsch', short: 'DE', flagClass: 'fi fi-de' },
  { code: 'fr', name: 'Français', short: 'FR', flagClass: 'fi fi-fr' },
  { code: 'be', name: 'Беларуская', short: 'BY', flagClass: 'fi fi-by' },
  { code: 'kk', name: 'Қазақша', short: 'KZ', flagClass: 'fi fi-kz' },
  { code: 'pl', name: 'Polski', short: 'PL', flagClass: 'fi fi-pl' },
  { code: 'sv', name: 'Svenska', short: 'SE', flagClass: 'fi fi-se' }
]

export const LANGUAGE_CHANGE_MESSAGES = {
  ru: (langName) => `Язык изменён на ${langName}`,
  en: (langName) => `Language changed to ${langName}`,
  de: (langName) => `Sprache auf ${langName} geändert`,
  fr: (langName) => `Langue changée en ${langName}`,
  be: (langName) => `Мова зменена на ${langName}`,
  kk: (langName) => `Тіл ${langName} тіліне өзгертілді`,
  pl: (langName) => `Język zmieniony na ${langName}`,
  sv: (langName) => `Språk ändrat till ${langName}`
}