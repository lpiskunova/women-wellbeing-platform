export interface Location {
    id: number
    type: string
    iso3: string | null
    name: string
    region?: string | null
    income_group?: string | null
    coverage_score?: number | null
    freshness_score?: number | null
}
  
export interface LocationsResponse {
    total: number
    items: Location[]
}
  
export interface IndicatorListItem {
    id: number
    code: string
    name: string
    description?: string | null
    higherIsBetter: boolean
    domain?: { code: string; name: string } | null
    unit?: { code: string; name: string; symbol?: string | null } | null
    source?: { code: string; name: string; url?: string | null } | null
    latestYear?: number | null
    coverageCount?: number | null
}
  
export interface IndicatorsResponse {
    total: number
    items: IndicatorListItem[]
}
  
export interface RankingsResponse {
    indicator: {
      code: string
      name: string
      description?: string | null
      higher_is_better: boolean
      domain?: { code: string; name: string } | null
      unit: { code: string; name: string; symbol?: string | null }
    }
    latestYear: number | null
    items: Array<{
      rank: number
      year: number
      value: number
      location: {
        iso3: string
        name: string
        region: string | null
        incomeGroup: string | null
      }
    }>
}
  