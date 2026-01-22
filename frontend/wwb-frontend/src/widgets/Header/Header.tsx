import { type FormEvent, useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Globe, Menu, Moon, Search, Sun, X } from 'lucide-react'
import { useHeaderSearch } from '@/shared/lib/useHeaderSearch'
import { cn } from '@/shared/lib/cn'
import { NAV_ITEMS, type HeaderLanguage, DEFAULT_LANGUAGE } from './header.constants'

import styles from './Header.module.scss'

type Theme = 'light' | 'dark'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [languageOpen, setLanguageOpen] = useState(false)
  const [language, setLanguage] = useState<HeaderLanguage>(DEFAULT_LANGUAGE)

  const [searchQuery, setSearchQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)

  const nav = useNavigate()

  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'light'
    const stored = window.localStorage.getItem('wwb-theme') as Theme | null
    return stored === 'dark' ? 'dark' : 'light'
  })

  const langRef = useRef<HTMLDivElement | null>(null)
  const searchRef = useRef<HTMLFormElement | null>(null)

  const isDark = theme === 'dark'
  const navItems = NAV_ITEMS[language]

  const { loading, error, locations, indicators, hasResults } = useHeaderSearch(searchQuery)

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')

    if (typeof window !== 'undefined') {
      window.localStorage.setItem('wwb-theme', theme)
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  useEffect(() => {
    if (!languageOpen) return

    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node
      if (langRef.current && !langRef.current.contains(target)) {
        setLanguageOpen(false)
      }
    }

    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [languageOpen])

  useEffect(() => {
    if (!searchOpen) return

    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node
      if (searchRef.current && !searchRef.current.contains(target)) {
        setSearchOpen(false)
      }
    }

    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [searchOpen])

  useEffect(() => {
    if (mobileMenuOpen) setSearchOpen(false)
  }, [mobileMenuOpen])

  const onNavClick = () => {
    setMobileMenuOpen(false)
    setSearchOpen(false)
  }

  const onSelectLocation = (iso3: string) => {
    setSearchOpen(false)
    setSearchQuery('')
    nav(`/countries/${iso3}`)
  }

  const onSelectIndicator = (code: string) => {
    setSearchOpen(false)
    setSearchQuery('')
    nav(`/indicators/${code}`)
  }

  const onSearchSubmit = (e: FormEvent) => {
    e.preventDefault()
    const q = searchQuery.trim()
    if (q.length < 2) return
    nav(`/discover?q=${encodeURIComponent(q)}`)
    setSearchOpen(false)
  }

  const noResultsText =
    language === 'en' ? 'No results' : 'Ничего не найдено'
  const searchingText =
    language === 'en' ? 'Searching…' : 'Поиск…'
  const countriesText =
    language === 'en' ? 'Countries' : 'Страны'
  const indicatorsText =
    language === 'en' ? 'Indicators' : 'Показатели'
  const errorText =
    language === 'en' ? 'Error' : 'Ошибка'

  return (
    <header className={styles.header}>
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
                  cn(styles.navLink, isActive && styles.navLinkActive)
                }
                onClick={onNavClick}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <form
            ref={searchRef}
            className={styles.searchWrap}
            onSubmit={onSearchSubmit}
            role="search"
          >
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
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setSearchOpen(true)
              }}
              onFocus={() => setSearchOpen(true)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setSearchOpen(false)
              }}
              autoComplete="off"
              aria-label={language === 'en' ? 'Global search' : 'Глобальный поиск'}
              aria-expanded={searchOpen}
            />

            {searchOpen && searchQuery.trim().length >= 2 && (
              <div className={styles.searchDropdown} role="listbox">
                {loading && <div className={styles.searchRow}>{searchingText}</div>}

                {error && (
                  <div className={styles.searchRow}>
                    {errorText}: {String(error)}
                  </div>
                )}

                {!loading && !error && !hasResults && (
                  <div className={styles.searchRow}>{noResultsText}</div>
                )}

                {!loading && !error && locations.length > 0 && (
                  <div className={styles.searchGroup}>
                    <div className={styles.searchGroupTitle}>{countriesText}</div>
                    {locations.map((l) => (
                      <button
                        type="button"
                        key={l.id}
                        className={styles.searchItem}
                        onClick={() => onSelectLocation(l.iso3!)}
                        role="option"
                      >
                        <span className={styles.searchMain}>{l.name}</span>
                        <span className={styles.searchMeta}>{l.iso3}</span>
                      </button>
                    ))}
                  </div>
                )}

                {!loading && !error && indicators.length > 0 && (
                  <div className={styles.searchGroup}>
                    <div className={styles.searchGroupTitle}>{indicatorsText}</div>
                    {indicators.map((i) => (
                      <button
                        type="button"
                        key={i.id}
                        className={styles.searchItem}
                        onClick={() => onSelectIndicator(i.code)}
                        role="option"
                      >
                        <span className={styles.searchMain}>{i.name}</span>
                        <span className={styles.searchMeta}>{i.code}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </form>
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
                    className={cn(styles.langItem, language === 'en' && styles.langItemActive)}
                    onClick={() => {
                      setLanguage('en')
                      setLanguageOpen(false)
                    }}
                    role="menuitem"
                  >
                    <span className={cn(styles.langDot, language === 'en' && styles.langDotActive)} />
                    English
                  </button>

                  <button
                    type="button"
                    className={cn(styles.langItem, language === 'ru' && styles.langItemActive)}
                    onClick={() => {
                      setLanguage('ru')
                      setLanguageOpen(false)
                    }}
                    role="menuitem"
                  >
                    <span className={cn(styles.langDot, language === 'ru' && styles.langDotActive)} />
                    Русский
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              className={cn(styles.iconBtn, styles.themeBtn)}
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
              className={cn(styles.iconBtn, styles.mobileBtn)}
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
                    cn(styles.mobileLink, isActive && styles.mobileLinkActive)
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
