import { describe, it, expect } from 'vitest'
import { cn } from '@/shared/lib/cn'

describe('cn utility', () => {
    it('joins non-empty classnames with spaces', () => {
        expect(cn('a', 'b', 'c')).toBe('a b c')
    })

    it('skips falsy values', () => {
        expect(cn('a', undefined, '', false, null, 'b')).toBe('a b')
    })

    it('returns empty string if all values falsy', () => {
        expect(cn(undefined, null, false, '')).toBe('')
    })
})
