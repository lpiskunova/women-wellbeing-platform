import type { SelectOption } from '@/components/ui/select/Select'
import type { CountriesSortKey } from './countries.interfaces'

export const FEATURED_INDICATORS_LIMIT = 10
export const METRICS_PER_COUNTRY = 3

export const SORT_OPTIONS: Array<SelectOption<CountriesSortKey>> = [
  { value: 'name', label: 'Sort by Name' },
  { value: 'coverage', label: 'Sort by Coverage' },
  { value: 'freshness', label: 'Sort by Freshness' },
]

export const ALL_REGIONS_LABEL = 'All Regions'
