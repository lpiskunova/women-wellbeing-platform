import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/ui/button/Button'

describe('Button', () => {
  it('renders as a button by default and handles click', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)

    const btn = screen.getByRole('button', { name: /click me/i })
    fireEvent.click(btn)
    expect(handleClick).toHaveBeenCalled()
  })

  it('supports asChild and merges className', () => {
    render(
      <Button asChild className="extra">
        <a href="/test">Link button</a>
      </Button>,
    )

    const link = screen.getByRole('link', { name: /link button/i })
    expect(link).toHaveClass('extra')
  })
})
