import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { IndicatorPage } from '@/pages/Indicator/IndicatorPage'
import { uiReducer } from '@/app/store/uiSlice'
import { indicatorsReducer, fetchIndicators } from '@/app/store/indicatorsSlice'
import type { Indicator } from '@/entities/indicator/indicator.interfaces'

const mockIndicator: Indicator = {
    code: 'WBL_INDEX',
    name: 'Women, Business and the Law index',
    description: 'Legal rights index',
    domain: { code: 'LAW_INST', name: 'Legal Rights' },
    unit: { code: 'INDEX100', name: 'Index 0-100' },
    source: { name: 'World Bank WBL' },
    latestYear: 2024,
    coverageCount: 190,
    coverage: null,
    higherIsBetter: true,
    polarity: 'HIGHER_IS_BETTER',
    updateYear: null,
    lastUpdated: null,
}

function createStoreWithIndicator() {
    const store = configureStore({
        reducer: {
            ui: uiReducer,
            indicators: indicatorsReducer,
        },
    })

    store.dispatch(
        fetchIndicators.fulfilled(
            { items: [mockIndicator], total: 1 },
            'test',
            undefined,
        ),
    )

    return store
}

describe('IndicatorPage', () => {
    beforeEach(() => {
        vi.resetAllMocks()
    })

    afterEach(() => {
        vi.unstubAllGlobals()
    })

    it('shows indicator header, meta info and allows switching tabs', async () => {
        const rankingsPayload = {
            indicator: {
                code: 'WBL_INDEX',
                name: mockIndicator.name,
                description: mockIndicator.description,
                higher_is_better: true,
                domain: { code: 'LAW_INST', name: 'Legal Rights' },
                unit: { code: 'INDEX100', name: 'Index 0-100', symbol: null },
            },
            latestYear: 2024,
            items: [
                {
                    rank: 1,
                    location: {
                        iso3: 'FRA',
                        name: 'France',
                        region: 'Europe',
                        incomeGroup: 'High',
                    },
                    year: 2024,
                    value: 96.9,
                },
            ],
        }

        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue({
                ok: true,
                json: async () => rankingsPayload,
            } as Response),
        )

        const store = createStoreWithIndicator()

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/indicators/WBL_INDEX']}>
                <Routes>
                    <Route path="/indicators/:code" element={<IndicatorPage />} />
                </Routes>
                </MemoryRouter>
            </Provider>,
        )

        expect(
            await screen.findByText(/women, business and the law index/i),
        ).toBeInTheDocument()

        expect(screen.getByText(/higher is better/i)).toBeInTheDocument()

        const unitNodes = screen.getAllByText(/index 0-100/i)
        expect(unitNodes.length).toBeGreaterThan(0)

        const sourceNodes = screen.getAllByText(/world bank wbl/i)
        expect(sourceNodes.length).toBeGreaterThan(0)

        await waitFor(() => {
            expect(
                screen.getByText(/latest country rankings/i),
            ).toBeInTheDocument()
        })

        const trendsTab = screen.getByRole('button', { name: /Time-Series/i })
        fireEvent.click(trendsTab)

        expect(
            await screen.findByText(/Trend for France/i),
        ).toBeInTheDocument()

        const mapTab = screen.getByRole('button', { name: /World Map/i })
        fireEvent.click(mapTab)

        expect(
            await screen.findByText(/Global Distribution \(2024\)/i),
        ).toBeInTheDocument()
    })

    it('shows rankings error message when rankings API fails', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue({
                ok: false,
                status: 500,
                json: async () => ({}),
            } as Response),
        )

        const store = createStoreWithIndicator()

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/indicators/WBL_INDEX']}>
                <Routes>
                    <Route path="/indicators/:code" element={<IndicatorPage />} />
                </Routes>
                </MemoryRouter>
            </Provider>,
        )

        expect(
            await screen.findByText(/couldn['’]t load rankings/i),
        ).toBeInTheDocument()
    })

    it('shows loading skeleton when indicators are loading', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue({
                ok: false,
                status: 500,
                json: async () => ({}),
            } as Response),
        )

        const store = configureStore({
            reducer: {
                ui: uiReducer,
                indicators: indicatorsReducer,
            },
        })

        store.dispatch(fetchIndicators.pending('test', undefined))

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/indicators/WBL_INDEX']}>
                <Routes>
                    <Route path="/indicators/:code" element={<IndicatorPage />} />
                </Routes>
                </MemoryRouter>
            </Provider>,
        )

        expect(screen.getByText(/Loading…/i)).toBeInTheDocument()
    })

    it('shows failed state when indicators request fails', async () => {
        const store = configureStore({
            reducer: {
                ui: uiReducer,
                indicators: indicatorsReducer,
            },
        })

        store.dispatch(
            fetchIndicators.rejected(
                new Error('Network error'),
                'test',
                undefined,
                'Network error',
            ),
        )

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/indicators/WBL_INDEX']}>
                <Routes>
                    <Route path="/indicators/:code" element={<IndicatorPage />} />
                </Routes>
                </MemoryRouter>
            </Provider>,
        )

        expect(
            await screen.findByText(/couldn['’]t load indicator/i),
        ).toBeInTheDocument()

        expect(
            screen.getByRole('button', { name: /Retry/i }),
        ).toBeInTheDocument()
    })

    it('shows "Indicator not found" when code is unknown', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue({
                ok: false,
                json: async () => ({}),
            } as Response),
        )

        const store = configureStore({
            reducer: {
                ui: uiReducer,
                indicators: indicatorsReducer,
            },
        })

        store.dispatch(
            fetchIndicators.fulfilled(
                { items: [], total: 0 },
                'test',
                undefined,
            ),
        )

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/indicators/UNKNOWN_CODE']}>
                <Routes>
                    <Route path="/indicators/:code" element={<IndicatorPage />} />
                </Routes>
                </MemoryRouter>
            </Provider>,
        )

        expect(
        await screen.findByText(/indicator not found/i),
        ).toBeInTheDocument()
    })
})
