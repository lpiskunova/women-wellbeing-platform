import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Input } from '@/components/ui/input/Input'

describe('Input', () => {
  it('renders input and forwards basic props', () => {
    render(<Input placeholder="Email" type="email" name="email" aria-label="Email input" />)

    const el = screen.getByLabelText('Email input') as HTMLInputElement
    expect(el).toBeInTheDocument()
    expect(el.type).toBe('email')
    expect(el.name).toBe('email')
    expect(el.placeholder).toBe('Email')
  })

  it('merges className and calls onChange', () => {
    const onChange = vi.fn()

    render(<Input aria-label="Search" className="extra" value="" onChange={onChange} />)

    const el = screen.getByLabelText('Search') as HTMLInputElement
    expect(el.className).toMatch(/extra/)

    fireEvent.change(el, { target: { value: 'abc' } })
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('supports disabled', () => {
    render(<Input aria-label="Disabled input" disabled />)

    const el = screen.getByLabelText('Disabled input') as HTMLInputElement
    expect(el.disabled).toBe(true)
  })
})
