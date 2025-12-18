import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { CountriesPage } from '@/pages/Countries/CountriesPage'
import { indicatorsReducer } from '@/app/store/indicatorsSlice'
import { uiReducer } from '@/app/store/uiSlice'
import { http } from '@/shared/api/http'

vi.mock('@/shared/api/http', () => ({
    http: {
        get: vi.fn(),
    },
}))

function createStore() {
    return configureStore({
        reducer: {
            ui: uiReducer,
            indicators: indicatorsReducer,
        },
    })
}

describe('CountriesPage', () => {
    beforeEach(() => {
        vi.resetAllMocks()
    })

    it('loads countries, featured indicators and renders country cards', async () => {
        const mockGet = http.get as unknown as ReturnType<typeof vi.fn>

        mockGet.mockImplementation((url: string) => {
            if (url === '/locations') {
                return Promise.resolve({
                    data: {
                        total: 1,
                        items: [
                            {
                                id: 1,
                                type: 'country',
                                iso3: 'FRA',
                                name: 'France',
                                region: 'Europe',
                                income_group: 'High',
                                coverage_score: 80,
                                freshness_score: 90,
                                note: null,
                            },
                        ],
                    },
                })
            }

            if (url === '/indicators') {
                return Promise.resolve({
                data: {
                        total: 1,
                        items: [
                            {
                                id: 10,
                                code: 'WBL_INDEX',
                                name: 'Women, Business and the Law index',
                                description: null,
                                higherIsBetter: true,
                                domain: null,
                                unit: null,
                                source: null,
                                latestYear: 2024,
                                coverageCount: 1,
                            },
                        ],
                    },
                })
            }

            if (url === '/observations/rankings') {
                return Promise.resolve({
                data: {
                    indicator: {
                        code: 'WBL_INDEX',
                        name: 'Women, Business and the Law index',
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
                            value: 96.5,
                        },
                    ],
                },
            })
        }

        return Promise.resolve({ data: {} })
        })

        const store = createStore()

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/countries']}>
                <CountriesPage />
                </MemoryRouter>
            </Provider>,
        )

        expect(
            await screen.findByText(/Country Profiles/i),
        ).toBeInTheDocument()

        expect(screen.getByText('France')).toBeInTheDocument()
        expect(screen.getByText(/Coverage:/i)).toBeInTheDocument()
        expect(screen.getByText(/Freshness:/i)).toBeInTheDocument()

        const compareLinks = screen.getAllByRole('link', { name: /Compare/i })
        const hrefs = compareLinks.map((a) => a.getAttribute('href'))
        expect(hrefs).toContain('/compare?countries=FRA')

        await waitFor(() => {
            expect(
                screen.getByText(/View Women, Business and the Law index/i),
            ).toBeInTheDocument()
        })
    })

    it('shows error card when countries request fails', async () => {
        const mockGet = http.get as unknown as ReturnType<typeof vi.fn>

        mockGet.mockImplementation((url: string) => {
            if (url === '/locations') {
                return Promise.reject(new Error('Countries API is down'))
            }
            if (url === '/indicators') {
                return Promise.resolve({
                data: { total: 0, items: [] },
                })
            }
            return Promise.resolve({ data: {} })
        })

        const store = createStore()

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/countries']}>
                <CountriesPage />
                </MemoryRouter>
            </Provider>,
        )

        const errorText = await screen.findByText(/Couldn’t load countries:/i)
        expect(errorText).toBeInTheDocument()
        expect(errorText.textContent).toContain('Countries API is down')
    })

    it('filters countries by search and clears filters', async () => {
        const mockGet = http.get as unknown as ReturnType<typeof vi.fn>

        mockGet.mockImplementation((url: string) => {
            if (url === '/locations') {
                return Promise.resolve({
                    data: {
                        total: 2,
                        items: [
                            {
                                id: 1,
                                type: 'country',
                                iso3: 'FRA',
                                name: 'France',
                                region: 'Europe',
                                income_group: 'High',
                                coverage_score: 80,
                                freshness_score: 90,
                                note: null,
                            },
                            {
                                id: 2,
                                type: 'country',
                                iso3: 'ARG',
                                name: 'Argentina',
                                region: 'Americas',
                                income_group: 'Upper middle',
                                coverage_score: 60,
                                freshness_score: 70,
                                note: null,
                            },
                        ],
                    },
                })
            }

            if (url === '/indicators') {
                return Promise.resolve({
                    data: { total: 0, items: [] },
                })
            }

            if (url === '/observations/rankings') {
                return Promise.resolve({
                    data: {
                        indicator: { code: 'X', name: 'X' },
                        latestYear: null,
                        items: [],
                    },
                })
            }

            return Promise.resolve({ data: {} })
        })

        const store = createStore()

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/countries']}>
                <CountriesPage />
                </MemoryRouter>
            </Provider>,
        )

        await screen.findByText('France')
        await screen.findByText('Argentina')

        const searchInput = screen.getByPlaceholderText(/Search countries/i)
        fireEvent.change(searchInput, { target: { value: 'fra' } })

        await waitFor(() => {
            expect(screen.getByText('France')).toBeInTheDocument()
            expect(screen.queryByText('Argentina')).not.toBeInTheDocument()
        })

        const clearButtons = screen.getAllByRole('button', { name: /Clear/i })
        fireEvent.click(clearButtons[0])

        await waitFor(() => {
            expect(screen.getByText('France')).toBeInTheDocument()
            expect(screen.getByText('Argentina')).toBeInTheDocument()
        })
    })
})
