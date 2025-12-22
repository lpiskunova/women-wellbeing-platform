import type { SelectOption } from '@/components/ui/select/Select'
import type { ApiLocation, CountriesSortKey, LocationsApiResponse } from './countries.interfaces'
import { http } from '@/shared/api/http'

export const FEATURED_INDICATORS_LIMIT = 10
export const METRICS_PER_COUNTRY = 3

export const SORT_OPTIONS: Array<SelectOption<CountriesSortKey>> = [
  { value: 'name', label: 'Sort by Name' },
  { value: 'coverage', label: 'Sort by Coverage' },
  { value: 'freshness', label: 'Sort by Freshness' },
]

export const ALL_REGIONS_LABEL = 'All Regions'

export function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
}

export function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n))
}

export function fmtValue(v: number): string {
  return v.toLocaleString(undefined, { maximumFractionDigits: 1 })
}

export function isAxiosCanceled(e: unknown): boolean {
  return typeof e === 'object' && e !== null && (e as { code?: unknown }).code === 'ERR_CANCELED'
}

export async function fetchAllCountries(): Promise<ApiLocation[]> {
  const limit = 100
  let offset = 0
  let total = 0
  const all: ApiLocation[] = []

  do {
    const res = await http.get<LocationsApiResponse>('/locations', {
      params: { limit, offset },
    })
    total = res.data.total
    all.push(...res.data.items)
    offset += limit
  } while (offset < total)

  return all.filter((l) => l.type === 'country' && !!l.iso3)
}
