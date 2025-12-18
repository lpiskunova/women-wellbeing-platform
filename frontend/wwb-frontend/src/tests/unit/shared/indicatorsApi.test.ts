import { describe, it, expect, vi, afterEach } from 'vitest'
import { getIndicators } from '@/shared/api/indicators'
import { http } from '@/shared/api/http'

vi.mock('@/shared/api/http', () => ({
    http: {
        get: vi.fn(),
    },
}))

type HttpGetMock = {
  mockResolvedValueOnce: (value: unknown) => void
}

const httpGetMock = http.get as unknown as HttpGetMock

describe('getIndicators', () => {
    afterEach(() => {
        vi.clearAllMocks()
    })

    it('returns items and total from /indicators with items[]', async () => {
        const mockItems = [
            { code: 'A', name: 'A' },
            { code: 'B', name: 'B' },
        ]

        httpGetMock.mockResolvedValueOnce({
            data: { items: mockItems, total: 42 },
        })

        const res = await getIndicators()

        expect(http.get).toHaveBeenCalledWith('/indicators')
        expect(res.items).toEqual(mockItems)
        expect(res.total).toBe(42)
    })

    it('falls back to indicators[] and uses length as total when total missing', async () => {
        const mockIndicators = [{ code: 'X', name: 'X' }]

        httpGetMock.mockResolvedValueOnce({
            data: { indicators: mockIndicators },
        })

        const res = await getIndicators()

        expect(http.get).toHaveBeenCalledWith('/indicators')
        expect(res.items).toEqual(mockIndicators)
        expect(res.total).toBe(1)
    })
})
