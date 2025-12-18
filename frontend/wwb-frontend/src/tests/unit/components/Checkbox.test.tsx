import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Checkbox } from '@/components/ui/checkbox/Checkbox'

describe('Checkbox', () => {
    it('calls onChange when toggled', () => {
        const onChange = vi.fn()
        render(<Checkbox label="Accept" checked={false} onChange={onChange} />)

        const checkbox = screen.getByLabelText(/accept/i) as HTMLInputElement
        expect(checkbox.checked).toBe(false)

        fireEvent.click(checkbox)
        expect(onChange).toHaveBeenCalledWith(true)
    })

    it('does not call onChange when disabled', () => {
        const onChange = vi.fn()
        render(<Checkbox label="Disabled" checked={false} disabled onChange={onChange} />)

        const checkbox = screen.getByLabelText(/disabled/i) as HTMLInputElement
        fireEvent.click(checkbox)

        expect(onChange).not.toHaveBeenCalled()
    })
})
