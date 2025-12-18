import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ReferencesPage } from '@/pages/References/ReferencesPage'
import { DATA_SOURCES } from '@/pages/References/entities/references.constants'

describe('ReferencesPage', () => {
    it('renders data sources list and filters by search', () => {
        render(
            <MemoryRouter initialEntries={['/references']}>
                <ReferencesPage />
            </MemoryRouter>,
        )

        expect(
            screen.getByText(/Data Sources & Licenses/i),
        ).toBeInTheDocument()

        expect(
            screen.getByText(DATA_SOURCES[0].name),
        ).toBeInTheDocument()

        const searchInput = screen.getByPlaceholderText(
            /Search data sources/i,
        ) as HTMLInputElement

        fireEvent.change(searchInput, { target: { value: 'World Bank' } })

        expect(screen.getByText(/World Bank/i)).toBeInTheDocument()
        expect(screen.queryByText(/GIWPS/i)).not.toBeInTheDocument()

        fireEvent.change(searchInput, { target: { value: 'zzzzzz' } })

        expect(
            screen.getByText(/No data sources found matching your search/i),
        ).toBeInTheDocument()

        const clearBtn = screen.getByRole('button', { name: /Clear search/i })
        fireEvent.click(clearBtn)

        expect(
            screen.getByText(DATA_SOURCES[0].name),
        ).toBeInTheDocument()
    })
})
