import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Globe, Menu, Moon, Search, Sun, X } from 'lucide-react'
import styles from './Header.module.scss'

type Theme = 'light' | 'dark'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [languageOpen, setLanguageOpen] = useState(false)
  const [language, setLanguage] = useState<'en' | 'ru'>('en')
  const [searchQuery, setSearchQuery] = useState('')
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'light'
    const stored = window.localStorage.getItem('wwb-theme') as Theme | null
    return stored === 'dark' ? 'dark' : 'light'
  })

  const langRef = useRef<HTMLDivElement | null>(null)
  const isDark = theme === 'dark'

  const navItems = useMemo(
    () => [
      { label: language === 'en' ? 'Home' : 'Главная', href: '/' },
      { label: language === 'en' ? 'Discover' : 'Обзор', href: '/discover' },
      { label: language === 'en' ? 'Countries' : 'Страны', href: '/countries' },
      { label: language === 'en' ? 'Compare' : 'Сравнить', href: '/compare' },
      { label: language === 'en' ? 'Research' : 'Исследования', href: '/research' },
      { label: language === 'en' ? 'Docs' : 'Документы', href: '/docs' },
    ],
    [language],
  )

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    window.localStorage.setItem('wwb-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  useEffect(() => {
    if (!languageOpen) return
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node
      if (langRef.current && !langRef.current.contains(target)) setLanguageOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [languageOpen])

  const onNavClick = () => setMobileMenuOpen(false)

  return (
    <header className={styles.header}>
      <a href="#main-content" className={styles.skipLink}>
        {language === 'en' ? 'Skip to main content' : 'Перейти к основному содержанию'}
      </a>

      <div className={styles.topBar} />

      <div className={styles.container}>
        <div className={styles.inner}>
          <Link to="/" className={styles.logo} onClick={onNavClick}>
            <div className={styles.logoMark} aria-hidden="true">
              W
            </div>

            <span className={styles.logoTextFull}>
              {language === 'en' ? "Women's Well-Being" : 'Благополучие женщин'}
            </span>
            <span className={styles.logoTextShort}>WWB</span>
          </Link>

          <nav className={styles.nav} aria-label="Main navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.href === '/'}
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                }
                onClick={onNavClick}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className={styles.searchWrap}>
            <Search className={styles.searchIcon} size={16} aria-hidden="true" />
            <input
              type="search"
              className={styles.searchInput}
              placeholder={
                language === 'en'
                  ? 'Search countries, indicators...'
                  : 'Поиск стран, показателей...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label={language === 'en' ? 'Global search' : 'Глобальный поиск'}
            />
          </div>

          <div className={styles.right}>
            <div className={styles.lang} ref={langRef}>
              <button
                type="button"
                className={styles.iconBtn}
                onClick={() => setLanguageOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={languageOpen}
                aria-label={language === 'en' ? 'Change language' : 'Изменить язык'}
              >
                <Globe size={16} />
              </button>

              {languageOpen && (
                <div className={styles.langMenu} role="menu">
                  <button
                    type="button"
                    className={`${styles.langItem} ${
                      language === 'en' ? styles.langItemActive : ''
                    }`}
                    onClick={() => {
                      setLanguage('en')
                      setLanguageOpen(false)
                    }}
                    role="menuitem"
                  >
                    <span
                      className={`${styles.langDot} ${
                        language === 'en' ? styles.langDotActive : ''
                      }`}
                    />
                    English
                  </button>

                  <button
                    type="button"
                    className={`${styles.langItem} ${
                      language === 'ru' ? styles.langItemActive : ''
                    }`}
                    onClick={() => {
                      setLanguage('ru')
                      setLanguageOpen(false)
                    }}
                    role="menuitem"
                  >
                    <span
                      className={`${styles.langDot} ${
                        language === 'ru' ? styles.langDotActive : ''
                      }`}
                    />
                    Русский
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              className={`${styles.iconBtn} ${styles.themeBtn}`}
              onClick={toggleTheme}
              aria-label={
                language === 'en'
                  ? isDark
                    ? 'Activate light theme'
                    : 'Activate dark theme'
                  : isDark
                  ? 'Включить светлую тему'
                  : 'Включить тёмную тему'
              }
            >
              {isDark ? <Moon size={16} /> : <Sun size={16} />}
            </button>

            <button
              type="button"
              className={`${styles.iconBtn} ${styles.mobileBtn}`}
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className={styles.mobileMenu}>
            <div className={styles.mobileSearch}>
              <Search className={styles.searchIcon} size={16} aria-hidden="true" />
              <input
                type="search"
                className={styles.searchInput}
                placeholder={language === 'en' ? 'Search...' : 'Поиск...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <nav className={styles.mobileNav} aria-label="Mobile navigation">
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  end={item.href === '/'}
                  className={({ isActive }) =>
                    `${styles.mobileLink} ${isActive ? styles.mobileLinkActive : ''}`
                  }
                  onClick={onNavClick}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
