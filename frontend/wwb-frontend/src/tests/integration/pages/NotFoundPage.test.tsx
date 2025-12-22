import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import NotFoundPage from '@/pages/NotFound/NotFoundPage'

describe('NotFoundPage', () => {
  it('renders 404 copy and navigation links', () => {
    render(
      <MemoryRouter initialEntries={['/nothing']}>
        <NotFoundPage />
      </MemoryRouter>,
    )

    expect(screen.getByText(/Page not found/i)).toBeInTheDocument()
    expect(screen.getByText(/We couldn't find this page/i)).toBeInTheDocument()

    const backLink = screen.getByRole('link', {
      name: /Back to Data Dictionary/i,
    })
    const homeLink = screen.getByRole('link', { name: /Go to homepage/i })

    expect(backLink).toHaveAttribute('href', '/discover')
    expect(homeLink).toHaveAttribute('href', '/')
  })
})
