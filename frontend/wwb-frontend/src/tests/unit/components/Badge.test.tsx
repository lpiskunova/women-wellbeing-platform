import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from '@/components/ui/badge/Badge'

describe('Badge', () => {
  it('renders with default variant', () => {
    render(<Badge>Default badge</Badge>)
    expect(screen.getByText('Default badge')).toBeInTheDocument()
  })

  it('supports subtle variant and custom className', () => {
    render(
      <Badge variant="subtle" className="extra">
        Subtle badge
      </Badge>,
    )
    const el = screen.getByText('Subtle badge')
    expect(el.className).toMatch(/extra/)
  })
})
