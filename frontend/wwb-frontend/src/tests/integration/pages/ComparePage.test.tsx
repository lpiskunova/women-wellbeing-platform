import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ComparePage from '@/pages/Compare/ComparePage'
import { API_BASE_URL } from '@/pages/Compare/entities/compare.constants'
import type {
  LocationsResponse,
  IndicatorsResponse,
  RankingsResponse,
} from '@/pages/Compare/entities/compare.interfaces'

function createJsonResponse<T>(data: T, ok = true, status = 200): Response {
    return {
        ok,
        status,
        statusText: ok ? 'OK' : 'Server Error',
        json: async () => data,
        text: async () => (typeof data === 'string' ? data : JSON.stringify(data)),
    } as unknown as Response
}

afterEach(() => {
    vi.unstubAllGlobals()
})

describe('ComparePage', () => {
    it('loads locations and indicators, allows selecting/removing countries and shows comparison cards', async () => {
        const locations: LocationsResponse = {
            total: 3,
            items: [
                {
                    id: 1,
                    type: 'country',
                    iso3: 'FRA',
                    name: 'France',
                    region: 'Europe',
                    income_group: 'High',
                    coverage_score: null,
                    freshness_score: null,
                },
                {
                    id: 2,
                    type: 'country',
                    iso3: 'AFG',
                    name: 'Afghanistan',
                    region: 'Asia',
                    income_group: 'Low',
                    coverage_score: null,
                    freshness_score: null,
                },
                {
                    id: 3,
                    type: 'country',
                    iso3: 'ARG',
                    name: 'Argentina',
                    region: 'Americas',
                    income_group: 'Upper middle',
                    coverage_score: null,
                    freshness_score: null,
                },
            ],
        }

        const indicators: IndicatorsResponse = {
            total: 1,
            items: [
                {
                    id: 10,
                    code: 'WBL_INDEX',
                    name: 'Women, Business and the Law index',
                    description: null,
                    higherIsBetter: true,
                    domain: { code: 'LAW', name: 'Legal Rights' },
                    unit: { code: 'INDEX100', name: 'Index 0-100', symbol: null },
                    source: { code: 'WBL', name: 'World Bank WBL', url: null },
                    latestYear: 2024,
                    coverageCount: 3,
                },
            ],
        }

        const rankings: RankingsResponse = {
            indicator: {
                code: 'WBL_INDEX',
                name: 'Women, Business and the Law index',
                description: null,
                higher_is_better: true,
                domain: { code: 'LAW', name: 'Legal Rights' },
                unit: { code: 'INDEX100', name: 'Index 0-100', symbol: null },
            },
            latestYear: 2024,
            items: [
                {
                    rank: 1,
                    year: 2024,
                    value: 97,
                    location: {
                        iso3: 'FRA',
                        name: 'France',
                        region: 'Europe',
                        incomeGroup: 'High',
                    },
                },
                {
                    rank: 2,
                    year: 2024,
                    value: 60,
                    location: {
                        iso3: 'AFG',
                        name: 'Afghanistan',
                        region: 'Asia',
                        incomeGroup: 'Low',
                    },
                },
            ],
        }

        const fetchMock = vi.fn((input: RequestInfo | URL) => {
            const url = input.toString()

            if (url.includes('/locations')) {
                return Promise.resolve(createJsonResponse<LocationsResponse>(locations))
            }
            if (url.includes('/indicators')) {
                return Promise.resolve(createJsonResponse<IndicatorsResponse>(indicators))
            }
            if (url.includes('/observations/rankings')) {
                return Promise.resolve(createJsonResponse<RankingsResponse>(rankings))
            }

            return Promise.reject(new Error(`Unexpected URL: ${url}`))
        })

        vi.stubGlobal('fetch', fetchMock as unknown as typeof fetch)

        render(
            <MemoryRouter initialEntries={['/compare']}>
                <ComparePage />
            </MemoryRouter>,
        )

        expect(
            await screen.findByText(/Compare Countries/i),
        ).toBeInTheDocument()

        expect(
            screen.getByText(/Women, Business and the Law index/i),
        ).toBeInTheDocument()

        const franceNodes = screen.getAllByText('France')
        expect(franceNodes.length).toBeGreaterThan(0)

        const afgNodes = screen.getAllByText('Afghanistan')
        expect(afgNodes.length).toBeGreaterThan(0)

        expect(
            screen.getByText(/Selected Countries \(2\/3\)/i),
        ).toBeInTheDocument()

        const select = screen.getByRole('combobox') as HTMLSelectElement
        expect(select.options.length).toBeGreaterThan(1)

        const valueToAdd = select.options[1].value
        fireEvent.change(select, { target: { value: valueToAdd } })

        expect(
            await screen.findByText(/Selected Countries \(3\/3\)/i),
        ).toBeInTheDocument()
        expect(screen.queryByRole('combobox')).not.toBeInTheDocument()

        const removeButtons = screen.getAllByRole('button', { name: '✕' })
        fireEvent.click(removeButtons[0])

        expect(
            await screen.findByText(/Selected Countries \(2\/3\)/i),
        ).toBeInTheDocument()
        expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('shows error panel when API fails', async () => {
        const fetchMock = vi.fn((input: RequestInfo | URL) => {
            const url = input.toString()
            if (url.includes('/locations')) {
                return Promise.resolve(
                    ({
                        ok: false,
                        status: 500,
                        statusText: 'Server Error',
                        json: async () => ({ message: 'BOOM' }),
                        text: async () => 'BOOM',
                    }) as unknown as Response,
                )
            }

            return Promise.resolve(createJsonResponse({ total: 0, items: [] }))
        })

        vi.stubGlobal('fetch', fetchMock as unknown as typeof fetch)

        render(
            <MemoryRouter initialEntries={['/compare']}>
                <ComparePage />
            </MemoryRouter>,
        )

        expect(
            await screen.findByText(/^Error$/i),
        ).toBeInTheDocument()

        expect(
            screen.getByText(/API 500 Server Error/i),
        ).toBeInTheDocument()

        expect(screen.getByText(/API:/i)).toBeInTheDocument()
        expect(screen.getByText(API_BASE_URL)).toBeInTheDocument()
    })

    it('shows hint panel when there are no available countries', async () => {
        const locations: LocationsResponse = {
            total: 0,
            items: [],
        }

        const indicators: IndicatorsResponse = {
            total: 1,
            items: [
                {
                    id: 10,
                    code: 'WBL_INDEX',
                    name: 'Women, Business and the Law index',
                    description: null,
                    higherIsBetter: true,
                    domain: { code: 'LAW', name: 'Legal Rights' },
                    unit: { code: 'INDEX100', name: 'Index 0-100', symbol: null },
                    source: { code: 'WBL', name: 'World Bank WBL', url: null },
                    latestYear: 2024,
                    coverageCount: 0,
                },
            ],
        }

        const rankings: RankingsResponse = {
            indicator: {
                code: 'WBL_INDEX',
                name: 'Women, Business and the Law index',
                description: null,
                higher_is_better: true,
                domain: { code: 'LAW', name: 'Legal Rights' },
                unit: { code: 'INDEX100', name: 'Index 0-100', symbol: null },
            },
            latestYear: null,
            items: [],
        }

        const fetchMock = vi.fn((input: RequestInfo | URL) => {
            const url = input.toString()

            if (url.includes('/locations')) {
                return Promise.resolve(createJsonResponse<LocationsResponse>(locations))
            }
            if (url.includes('/indicators')) {
                return Promise.resolve(createJsonResponse<IndicatorsResponse>(indicators))
            }
            if (url.includes('/observations/rankings')) {
                return Promise.resolve(createJsonResponse<RankingsResponse>(rankings))
            }

            return Promise.reject(new Error(`Unexpected URL: ${url}`))
        })

        vi.stubGlobal('fetch', fetchMock as unknown as typeof fetch)

        render(
            <MemoryRouter initialEntries={['/compare']}>
                <ComparePage />
            </MemoryRouter>,
        )

        expect(
            await screen.findByText(/Compare Countries/i),
        ).toBeInTheDocument()

        expect(
            screen.getByText(/Select at least one country to begin comparison\./i),
        ).toBeInTheDocument()

        const exportBtn = screen.getByRole('button', { name: /Export CSV/i })
        const shareBtn = screen.getByRole('button', { name: /Share Link/i })
        expect(exportBtn).toBeDisabled()
        expect(shareBtn).toBeDisabled()
    })
})
