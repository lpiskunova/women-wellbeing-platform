import { http } from '@/shared/api/http'
import type { Indicator } from '@/entities/indicator/indicator.interfaces'

export type IndicatorsListResult = {
  items: Indicator[]
  total: number
}

export type IndicatorsQuery = {
  q?: string
  domain?: string
  limit?: number
  offset?: number
}

export async function getIndicators(params?: IndicatorsQuery): Promise<IndicatorsListResult> {
  const res = await http.get<IndicatorsListResult>('/indicators', {
    params,
  })
  return res.data
}

export async function getIndicatorByCode(code: string): Promise<Indicator> {
  const res = await http.get<Indicator>(`/indicators/${code}`)
  return res.data
}
