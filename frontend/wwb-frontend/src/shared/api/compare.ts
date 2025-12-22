import { http } from '@/shared/api/http'
import type { Unit } from './observations'

export type CompareItem = {
  rank: number
  year: number
  value: number | null
  note: string | null
  status: string | null
  location: {
    iso3: string
    name: string
    region: string | null
    income_group: string | null
  }
  unit_code: string
  data_source_code: string
  gender_code: string | null
  age_group_code: string | null
}

export type CompareResponse = {
  indicator: {
    code: string
    name: string
    year: number
    higher_is_better: boolean
    unit: Unit
  }
  items: CompareItem[]
}

export type CompareQuery = {
  indicatorCode: string
  year: number
  locations: string[]
}

export async function compareLocations(params: CompareQuery): Promise<CompareResponse> {
  const { indicatorCode, year, locations } = params

  const res = await http.get<CompareResponse>('/compare', {
    params: {
      indicatorCode,
      year,
      locations: locations.join(','),
    },
  })

  return res.data
}
