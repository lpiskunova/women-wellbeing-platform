import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { IndicatorPage } from '@/pages/Indicator/IndicatorPage'
import { uiReducer } from '@/app/store/uiSlice'
import { indicatorsReducer, fetchIndicators } from '@/app/store/indicatorsSlice'
import type { Indicator } from '@/entities/indicator/indicator.interfaces'

const mockIndicator: Indicator = {
  id: 10,
  code: 'WBL_INDEX',
  name: 'Women, Business and the Law index',
  description: 'Legal rights index',
  domain: { code: 'LAW_INST', name: 'Legal Rights' },
  unit: { code: 'INDEX100', name: 'Index 0-100' },
  source: { code: 'WBL', name: 'World Bank WBL', url: null },
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

  store.dispatch(fetchIndicators.fulfilled({ items: [mockIndicator], total: 1 }, 'test', undefined))

  return store
}

describe('IndicatorPage', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
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
      screen.getByRole('button', { name: /retry/i }),
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
      fetchIndicators.fulfilled({ items: [], total: 0 }, 'test', undefined),
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

    expect(
      screen.getByRole('link', { name: /back to data dictionary/i }),
    ).toBeInTheDocument()
  })
})
