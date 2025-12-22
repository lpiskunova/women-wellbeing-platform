export type HeaderLanguage = 'en' | 'ru'

export type NavItem = {
  href: string
  label: string
}

export const NAV_ITEMS: Record<HeaderLanguage, NavItem[]> = {
  en: [
    { label: 'Home', href: '/' },
    { label: 'Discover', href: '/discover' },
    { label: 'Countries', href: '/countries' },
    { label: 'Compare', href: '/compare' },
    { label: 'Research', href: '/research' },
    { label: 'Docs', href: '/docs' },
  ],
  ru: [
    { label: 'Главная', href: '/' },
    { label: 'Обзор', href: '/discover' },
    { label: 'Страны', href: '/countries' },
    { label: 'Сравнить', href: '/compare' },
    { label: 'Исследования', href: '/research' },
    { label: 'Документы', href: '/docs' },
  ],
}

export const DEFAULT_LANGUAGE: HeaderLanguage = 'en'
