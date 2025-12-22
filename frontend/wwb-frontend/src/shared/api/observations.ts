import { http } from '@/shared/api/http'

export type IndicatorDomain = {
  code: string
  name: string
}

export type Unit = {
  code: string
  name: string
  symbol: string | null
}

export type ObservationsIndicator = {
  code: string
  name: string
  description: string | null
  higher_is_better: boolean
  domain: IndicatorDomain
  unit: Unit
}

export type ObservationItem = {
  id: number
  year: number
  value: number | null
  note: string | null
  location_iso3: string
  location_name: string
  unit_code: string
  data_source_code: string
  gender_code: string | null
  age_group_code: string | null
  observation_status_code: string | null
}

export type ObservationsResponse = {
  indicator: ObservationsIndicator
  items: ObservationItem[]
}

export type ObservationsQuery = {
  indicatorCode: string
  locationIso3: string
  yearFrom?: number
  yearTo?: number
  gender?: string
  ageGroup?: string
  children?: string
  household?: string
}

export async function getObservations(params: ObservationsQuery): Promise<ObservationsResponse> {
  const res = await http.get<ObservationsResponse>('/observations', {
    params,
  })
  return res.data
}

export type IndicatorRankingItem = {
  rank: number
  location: {
    iso3: string
    name: string
    region: string | null
    incomeGroup: string | null
  }
  year: number
  value: number
}

export type IndicatorRankingsResponse = {
  indicator: ObservationsIndicator
  latestYear: number | null
  items: IndicatorRankingItem[]
}

export async function getIndicatorRankings(
  indicatorCode: string,
  limit = 200,
): Promise<IndicatorRankingsResponse> {
  const res = await http.get<IndicatorRankingsResponse>('/observations/rankings', {
    params: { indicatorCode, limit },
  })
  return res.data
}
