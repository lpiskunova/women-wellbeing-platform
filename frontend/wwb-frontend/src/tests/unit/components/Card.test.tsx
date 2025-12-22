import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card/Card'

describe('Card', () => {
  it('renders Card and merges className', () => {
    render(
      <Card className="extra" data-testid="card">
        <span>Inside</span>
      </Card>,
    )

    const card = screen.getByTestId('card')
    expect(card).toBeInTheDocument()
    expect(card.className).toMatch(/extra/)
    expect(screen.getByText('Inside')).toBeInTheDocument()
  })

  it('renders Card subcomponents with correct semantics', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardHeader>
        <CardContent>Content</CardContent>
      </Card>,
    )

    const title = screen.getByRole('heading', { level: 3, name: 'Title' })
    expect(title).toBeInTheDocument()
    expect(title.tagName).toBe('H3')

    const desc = screen.getByText('Description')
    expect(desc).toBeInTheDocument()
    expect(desc.tagName).toBe('P')

    expect(screen.getByText('Content')).toBeInTheDocument()
  })
})
