import { http } from '@/shared/api/http'
import type { Indicator } from '@/entities/indicator/indicator.interfaces';

export type IndicatorsListResult = { items: Indicator[]; total: number }

function pickArray(data: unknown): unknown[] {
  if (Array.isArray(data)) return data
  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>
    const arr =
      (Array.isArray(obj.indicators) && obj.indicators) ||
      (Array.isArray(obj.items) && obj.items) ||
      (Array.isArray(obj.data) && obj.data)
    if (arr) return arr
  }
  return []
}

function pickTotal(data: unknown, fallback: number): number {
  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>
    const t = obj.total
    if (typeof t === 'number' && Number.isFinite(t)) return t
  }
  return fallback
}

export async function getIndicators(): Promise<IndicatorsListResult> {
  const res = await http.get('/indicators')
  const arr = pickArray(res.data)
  const items = arr as Indicator[]
  return { items, total: pickTotal(res.data, items.length) }
}
