import { http } from '@/shared/api/http'

export type Location = {
  id: number
  type: string
  iso3: string | null
  name: string
  region: string | null
  income_group: string | null
  coverage_score: number | null
  freshness_score: number | null
  note: string | null
}

export type LocationsListResult = {
  total: number
  items: Location[]
}

export type LocationsQuery = {
  q?: string
  region?: string
  limit?: number
  offset?: number
}

export async function getLocations(params?: LocationsQuery): Promise<LocationsListResult> {
  const res = await http.get<LocationsListResult>('/locations', {
    params,
  })
  return res.data
}

export async function getLocationByIso3(iso3: string): Promise<Location> {
  const res = await http.get<Location>(`/locations/${iso3}`)
  return res.data
}
