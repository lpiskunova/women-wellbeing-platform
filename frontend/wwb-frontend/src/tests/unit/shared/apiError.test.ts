import { describe, it, expect, vi, afterEach } from 'vitest'
import axios from 'axios'
import { getErrorMessage } from '@/shared/api/apiError'

describe('getErrorMessage', () => {
    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('returns message from API envelope if present', () => {
        vi.spyOn(axios, 'isAxiosError').mockReturnValue(true)

        const err = {
            response: {
                data: {
                    error: {
                        message: 'Validation failed',
                    },
                },
            },
            message: 'Network error',
        }

        expect(getErrorMessage(err)).toBe('Validation failed')
    })

    it('falls back to err.message for Axios error without envelope', () => {
        vi.spyOn(axios, 'isAxiosError').mockReturnValue(true)

        const err = {
            message: 'Request failed with status code 500',
        }

        expect(getErrorMessage(err)).toBe('Request failed with status code 500')
    })

    it('uses Error.message for non-axios Error instance', () => {
        const err = new Error('Something broke')
        expect(getErrorMessage(err)).toBe('Something broke')
    })

    it('returns "Unknown error" for non-error values', () => {
        expect(getErrorMessage(null)).toBe('Unknown error')
        expect(getErrorMessage('oops')).toBe('Unknown error')
    })
})
