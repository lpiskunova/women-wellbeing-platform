import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'

import { DiscoverPage } from '@/pages/Discover/DiscoverPage'
import { uiReducer } from '@/app/store/uiSlice'
import { indicatorsReducer } from '@/app/store/indicatorsSlice'
import type { Indicator } from '@/entities/indicator/indicator.interfaces'
import * as indicatorsApi from '@/shared/api/indicators'

vi.mock('@/shared/api/indicators')

const mockIndicators: Indicator[] = [
    {
        code: 'WBL_INDEX',
        name: 'Women, Business and the Law index',
        description: 'Legal rights',
        domain: { code: 'LAW_INST', name: 'Legal Rights' },
        unit: { name: 'Index 0-100' },
        source: { name: 'World Bank' },
        latestYear: 2024,
        coverageCount: 190,
        coverage: null,
        polarity: 'HIGHER_IS_BETTER',
        higherIsBetter: true,
        updateYear: null,
        lastUpdated: null,
    },
    {
        code: 'UNODC_FEMICIDE_RATE_100K',
        name: 'Femicide rate',
        description: 'Intentional homicide of women and girls',
        domain: { code: 'SAFETY_VIOLENCE', name: 'Safety & Violence' },
        unit: { name: 'Rate per 100k' },
        source: { name: 'UNODC' },
        latestYear: 2023,
        coverageCount: 150,
        coverage: null,
        polarity: 'LOWER_IS_BETTER',
        higherIsBetter: false,
        updateYear: null,
        lastUpdated: null,
    },
]

function createStore() {
    return configureStore({
        reducer: {
            ui: uiReducer,
            indicators: indicatorsReducer,
        },
    })
}

describe('DiscoverPage', () => {
    beforeEach(() => {
        vi.resetAllMocks()
    })

    it('loads indicators and allows search by name', async () => {
        vi.mocked(indicatorsApi.getIndicators).mockResolvedValueOnce({
            items: mockIndicators,
            total: mockIndicators.length,
        })

        const store = createStore()

        render(
            <Provider store={store}>
                <MemoryRouter>
                <DiscoverPage />
                </MemoryRouter>
            </Provider>,
        )

        await screen.findByText(/women, business and the law index/i)

        const searchInput = screen.getByPlaceholderText(
            /search indicators by name or description/i,
        )

        fireEvent.change(searchInput, { target: { value: 'Femicide' } })

        await waitFor(() => {
            expect(screen.getByText(/femicide rate/i)).toBeInTheDocument()
            expect(
                screen.queryByText(/women, business and the law index/i),
            ).not.toBeInTheDocument()
        })
    })

    it('shows error card if loading fails', async () => {
        vi.mocked(indicatorsApi.getIndicators).mockRejectedValueOnce(
            new Error('Backend is down'),
        )

        const store = createStore()

        render(
            <Provider store={store}>
                <MemoryRouter>
                <DiscoverPage />
                </MemoryRouter>
            </Provider>,
        )

        const errorTitle = await screen.findByText(/couldn’t load indicators/i)
        expect(errorTitle).toBeInTheDocument()
    })
})
