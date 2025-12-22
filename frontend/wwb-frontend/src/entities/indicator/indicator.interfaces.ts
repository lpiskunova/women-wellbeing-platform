export type IndicatorPolarity = 'HIGHER_IS_BETTER' | 'LOWER_IS_BETTER' | 'NEUTRAL'

export type NamedRefObject = {
  code?: string | null
  name?: string | null
  symbol?: string | null
  url?: string | null
}

export type NamedRef = NamedRefObject | string | null

export interface Indicator {
  id: number
  code: string
  name: string
  description?: string | null

  domain?: NamedRef
  source?: NamedRef
  unit?: NamedRef

  polarity?: IndicatorPolarity | null
  higherIsBetter?: boolean | null

  latestYear?: number | null
  coverageCount?: number | null

  updateYear?: number | null
  coverage?: number | null
  lastUpdated?: string | null
}
