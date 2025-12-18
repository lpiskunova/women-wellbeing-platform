export type CountriesSortKey = 'name' | 'coverage' | 'freshness'

export type ApiLocation = {
  id: number
  type: string
  iso3: string | null
  name: string
  region: string | null
  income_group: string | null
  coverage_score: number | null
  freshness_score: number | null
  note?: string | null
}

export type LocationsApiResponse = {
  total: number
  items: ApiLocation[]
}

export type CountryMetric = {
  indicatorCode: string
  indicatorName: string
  value: number
  year: number
  rank?: number
  isOutdated?: boolean
}

export type CountryProfile = {
  iso3: string
  name: string
  region: string
  coverageScore: number | null
  freshnessScore: number | null
  metrics: CountryMetric[]
}

export type RankingsApiResponse = {
  indicator: {
    code: string
    name: string
    description?: string | null
    higher_is_better?: boolean
    domain?: { code?: string; name?: string }
    unit?: { code?: string; name?: string; symbol?: string | null }
  }
  latestYear: number | null
  items: Array<{
    rank: number
    location: {
      iso3: string
      name: string
      region?: string | null
      incomeGroup?: string | null
    }
    year: number
    value: number | null
  }>
}
