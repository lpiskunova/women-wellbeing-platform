import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('@/pages/Home/entities/home.constants', async () => {
  const actual = await vi.importActual<typeof import('@/pages/Home/entities/home.constants')>(
    '@/pages/Home/entities/home.constants',
  )

  return {
    ...actual,
    dataSources: [
      ...actual.dataSources,
      {
        name: 'Test dataset with unknown color',
        description: 'For badge fallback test',
        coverage: 'Global',
        updated: 'Fallback badge',
        color: 'unknown-color',
      },
    ],
  }
})

describe('HomePage', () => {
  it('renders hero title and CTA buttons', async () => {
    const { HomePage } = await import('@/pages/Home/HomePage')

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    )

    expect(screen.getByText(/women's well-being evaluation platform/i)).toBeInTheDocument()

    expect(screen.getByRole('link', { name: /explore data/i })).toBeInTheDocument()

    expect(screen.getByRole('link', { name: /read methodology/i })).toBeInTheDocument()
  })

  it('uses default badge style when data source has unknown color', async () => {
    const { HomePage } = await import('@/pages/Home/HomePage')

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    )

    expect(screen.getByText(/Fallback badge/i)).toBeInTheDocument()
  })
})
