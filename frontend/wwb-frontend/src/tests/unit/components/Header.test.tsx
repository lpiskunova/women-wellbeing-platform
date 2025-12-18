import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Header } from '@/widgets/Header/Header'

describe('Header', () => {
    beforeEach(() => {
        document.documentElement.className = ''
        window.localStorage.clear()
    })

    const renderHeader = () =>
        render(
        <MemoryRouter initialEntries={['/']}>
            <Header />
        </MemoryRouter>,
        )

    it('renders navigation links', () => {
        renderHeader()
        expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument()
        expect(screen.getByRole('link', { name: /discover/i })).toBeInTheDocument()
    })

    it('toggles theme and writes to localStorage', () => {
        renderHeader()

        const themeBtn = screen.getByRole('button', {
            name: /activate dark theme/i,
        })

        fireEvent.click(themeBtn)

        expect(document.documentElement.classList.contains('dark')).toBe(true)
        expect(window.localStorage.getItem('wwb-theme')).toBe('dark')
    })

    it('opens language menu and switches to Russian', () => {
        renderHeader()

        const langBtn = screen.getByRole('button', {
            name: /change language/i,
        })
        fireEvent.click(langBtn)

        const ruItem = screen.getByRole('menuitem', { name: /русский/i })
        fireEvent.click(ruItem)

        expect(screen.getByRole('link', { name: /главная/i })).toBeInTheDocument()
    })
})
