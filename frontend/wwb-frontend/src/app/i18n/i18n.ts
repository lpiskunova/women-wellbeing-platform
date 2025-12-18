import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: { common: { nav: { home: 'Home' } } },
  ru: { common: { nav: { home: 'Главная' } } },
} as const

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  defaultNS: 'common',
  interpolation: { escapeValue: false },
})

export default i18n
