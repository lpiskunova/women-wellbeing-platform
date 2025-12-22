import type { Location as ApiLocation, LocationsListResult } from '@/shared/api/locations'
import type { Indicator } from '@/entities/indicator/indicator.interfaces'
import type { IndicatorRankingsResponse } from '@/shared/api/observations'

export type Location = ApiLocation

export type LocationsResponse = LocationsListResult

export type IndicatorListItem = Indicator

export interface IndicatorsResponse {
  total: number
  items: IndicatorListItem[]
}

export type RankingsResponse = IndicatorRankingsResponse
