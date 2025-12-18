import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SensitiveContentBanner } from '@/components/ui/sensitive-content-banner/SensitiveContentBanner'

describe('SensitiveContentBanner', () => {
    it('shows message and hides after clicking close', () => {
        render(<SensitiveContentBanner message="Sensitive text" />)

        expect(screen.getByText('Sensitive text')).toBeInTheDocument()

        const button = screen.getByRole('button', {
            name: /dismiss sensitive content notice/i,
        })
        fireEvent.click(button)

        expect(screen.queryByText('Sensitive text')).not.toBeInTheDocument()
    })

    it('does not render if defaultHidden is true', () => {
        render(<SensitiveContentBanner message="Hidden msg" defaultHidden />)
        expect(screen.queryByText('Hidden msg')).not.toBeInTheDocument()
    })
})
