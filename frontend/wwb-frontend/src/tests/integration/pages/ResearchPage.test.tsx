import type { Mock } from 'vitest'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { ResearchPage } from '@/pages/Research/ResearchPage'
import { http } from '@/shared/api/http'
import type {
  ResearchTemplateFull,
  ResearchTemplateSummary,
  ResearchTemplatesListResponse,
} from '@/pages/Research/entities/research.interfaces'

vi.mock('@/components/ui/select/Select', () => {
  type Option<T extends string> = { value: T; label: string }

  function Select<T extends string>({
    value,
    options,
    onValueChange,
    ariaLabel,
  }: {
    value: T
    options: ReadonlyArray<Option<T>>
    onValueChange: (next: T) => void
    ariaLabel?: string
    className?: string
    triggerClassName?: string
  }) {
    return (
      <select
        aria-label={ariaLabel}
        value={value}
        onChange={(e) => onValueChange(e.target.value as T)}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    )
  }

  return { Select }
})

vi.mock('@/shared/api/http', () => ({
  http: {
    get: vi.fn(),
  },
}))

type HttpGetMock = Mock<
  (url: string, config?: unknown) => Promise<{ data: unknown }>
>

function baseTemplates(): ResearchTemplateSummary[] {
  return [
    {
      id: 'wbl-top',
      title: 'Top WBL countries',
      description: 'Ranking by WBL score',
      type: 'template',
      topic: 'Legal Rights',
      years: '2020–2024',
      criteria: ['WBL score ≥ 90'],
      lastUpdated: '2024',
      sources: ['World Bank WBL'],
    },
    {
      id: 'femicide-policy-brief',
      title: 'Femicide and policy action',
      description: 'Brief on femicide and measures',
      type: 'brief',
      topic: 'Safety & Violence',
      years: '2010–2024',
      criteria: ['Femicide rate', 'Policy count'],
      lastUpdated: '2023',
      sources: ['UNODC', 'UN Women'],
    },
  ]
}

function mockSuccessfulResearchApi() {
  const templates = baseTemplates()

  const templateFull: ResearchTemplateFull = {
    ...templates[0],
    results: [
      {
        country: 'France',
        region: 'Europe',
        year: '2024',
        values: { 'WBL score': 96.5 },
        meetsAllCriteria: true,
      },
      {
        country: 'Brazil',
        region: 'Americas',
        year: '2024',
        values: { 'WBL score': 85.1 },
        meetsAllCriteria: false,
      },
    ],
  }

  const briefFull: ResearchTemplateFull = {
    ...templates[1],
    keyFindings: ['Key finding A', 'Key finding B'],
    leaderCountries: [{ name: 'France', femicideRate: '0.5', measuresCount: 5 }],
    gapCountries: [{ name: 'Country X', femicideRate: '4.2', measuresCount: 1 }],
  }

  const mockGet = http.get as unknown as HttpGetMock

  mockGet.mockImplementation((url: string) => {
    if (url === '/research/templates') {
      const data: ResearchTemplatesListResponse = { items: templates }
      return Promise.resolve({ data })
    }

    if (url === '/research/templates/wbl-top') {
      return Promise.resolve({ data: templateFull })
    }

    if (url === '/research/templates/femicide-policy-brief') {
      return Promise.resolve({ data: briefFull })
    }

    return Promise.reject(new Error(`Unexpected URL: ${url}`))
  })

  return { templates, templateFull, briefFull }
}

function mockResearchApiWithEmptyResults() {
  const templates = baseTemplates()

  const templateFull: ResearchTemplateFull = {
    ...templates[0],
    results: [],
  }

  const briefFull: ResearchTemplateFull = {
    ...templates[1],
    keyFindings: ['Some finding'],
  }

  const mockGet = http.get as unknown as HttpGetMock

  mockGet.mockImplementation((url: string) => {
    if (url === '/research/templates') {
      const data: ResearchTemplatesListResponse = { items: templates }
      return Promise.resolve({ data })
    }

    if (url === '/research/templates/wbl-top') {
      return Promise.resolve({ data: templateFull })
    }

    if (url === '/research/templates/femicide-policy-brief') {
      return Promise.resolve({ data: briefFull })
    }

    return Promise.reject(new Error(`Unexpected URL: ${url}`))
  })
}

describe('ResearchPage', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('renders template and brief cards with table and findings', async () => {
    mockSuccessfulResearchApi()

    render(
      <MemoryRouter initialEntries={['/research']}>
        <ResearchPage />
      </MemoryRouter>,
    )

    expect(
      screen.getByText(/Fetching research templates/i),
    ).toBeInTheDocument()

    expect(
      await screen.findByText(/Research — Findings & Templates/i),
    ).toBeInTheDocument()

    expect(screen.getByText(/Top WBL countries/i)).toBeInTheDocument()
    expect(screen.getAllByText(/Template/i).length).toBeGreaterThan(0)

    expect(
      screen.getByRole('columnheader', { name: /Country/i }),
    ).toBeInTheDocument()
    const franceCells = screen.getAllByText('France')
    expect(franceCells.length).toBeGreaterThan(0)

    expect(
      screen.getByText(/Femicide and policy action/i),
    ).toBeInTheDocument()
    expect(screen.getAllByText(/Brief/i).length).toBeGreaterThan(0)
    expect(screen.getByText(/Key findings/i)).toBeInTheDocument()

    expect(screen.getAllByText(/Last Updated:/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Methodology/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Limitations/i).length).toBeGreaterThan(0)
  })

  it('shows "No results for selected region" when template has no rows for that region', async () => {
    mockResearchApiWithEmptyResults()

    render(
      <MemoryRouter initialEntries={['/research']}>
        <ResearchPage />
      </MemoryRouter>,
    )

    await screen.findByText(/Top WBL countries/i)

    const regionSelect = screen.getByLabelText('Region')
    fireEvent.change(regionSelect, { target: { value: 'Africa' } })

    await waitFor(() => {
      expect(
        screen.getByText(/No results for selected region\./i),
      ).toBeInTheDocument()
    })
  })

  it('shows error card when research API fails', async () => {
    const mockGet = http.get as HttpGetMock
    mockGet.mockRejectedValueOnce(new Error('Boom'))

    render(
      <MemoryRouter initialEntries={['/research']}>
        <ResearchPage />
      </MemoryRouter>,
    )

    expect(
      await screen.findByText(/Failed to load Research data\./i),
    ).toBeInTheDocument()
  })
})

