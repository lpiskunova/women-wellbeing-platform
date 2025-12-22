import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { DocsPage } from '@/pages/Docs/DocsPage'

describe('DocsPage', () => {
  it('shows Methodology tab by default', () => {
    render(
      <MemoryRouter>
        <DocsPage />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: /Documentation/i })).toBeInTheDocument()

    expect(screen.getByRole('tab', { name: /Methodology/i })).toHaveAttribute(
      'aria-selected',
      'true',
    )

    expect(screen.getByRole('heading', { name: /Data Methodology/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Data Sources/i })).toBeInTheDocument()
  })

  it('switches to Limitations tab when clicked', () => {
    render(
      <MemoryRouter>
        <DocsPage />
      </MemoryRouter>,
    )

    const limitationsTab = screen.getByRole('tab', { name: /Limitations/i })
    fireEvent.click(limitationsTab)

    expect(screen.getByRole('heading', { name: /Data Limitations/i })).toBeInTheDocument()

    expect(screen.getByRole('heading', { name: /Coverage Gaps/i })).toBeInTheDocument()
  })
})
