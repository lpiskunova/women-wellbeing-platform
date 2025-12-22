import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Select, type SelectOption } from '@/components/ui/select/Select'

type Value = 'a' | 'b' | 'c'

const options: ReadonlyArray<SelectOption<Value>> = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
  { value: 'c', label: 'Option C' },
]

describe('Select', () => {
  it('renders selected label and opens/closes menu on click', () => {
    const onChange = vi.fn()
    render(
      <Select<Value>
        value="b"
        options={options}
        onValueChange={onChange}
        ariaLabel="Test select"
      />,
    )

    const trigger = screen.getByRole('button', { name: /test select/i })
    expect(screen.getByText('Option B')).toBeInTheDocument()

    fireEvent.click(trigger)
    expect(screen.getByRole('listbox')).toBeInTheDocument()

    const optionA = screen.getByRole('option', { name: 'Option A' })
    fireEvent.click(optionA)
    expect(onChange).toHaveBeenCalledWith('a')
  })

  it('supports basic keyboard navigation', () => {
    const onChange = vi.fn()
    render(
      <Select<Value>
        value="a"
        options={options}
        onValueChange={onChange}
        ariaLabel="Keyboard select"
      />,
    )

    const trigger = screen.getByRole('button', { name: /keyboard select/i })

    fireEvent.keyDown(trigger, { key: 'ArrowDown' })
    expect(screen.getByRole('listbox')).toBeInTheDocument()

    const first = screen.getByRole('option', { name: 'Option A' })
    expect(first).toHaveAttribute('aria-selected', 'true')
  })
})
