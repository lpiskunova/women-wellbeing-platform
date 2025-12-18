export const MAX_SELECTED_COUNTRIES = 3
export const QS_COUNTRIES = 'countries'

export const API_BASE_URL =
  import.meta?.env?.VITE_API_BASE_URL?.replace(/\/$/, '') ||
  'http://localhost:4000/api'

export const LIMITS = {
  LOCATIONS: 300,
  INDICATORS: 100,
  RANKINGS: 500,
}

export const ENDPOINTS = {
  LOCATIONS: '/locations',
  INDICATORS: '/indicators',
  RANKINGS: '/observations/rankings',
}

export const DEFAULT_ISO3_PRIORITY = ['FRA', 'AFG']

export const buildApiUrl = (pathWithQuery: string) => `${API_BASE_URL}${pathWithQuery}`

export const normalizeIso3 = (v: string) => v.trim().toUpperCase()

export const parseCountriesParam = (value: string | null) => {
  if (!value) return []
  return value
    .split(',')
    .map(normalizeIso3)
    .filter(Boolean)
    .slice(0, MAX_SELECTED_COUNTRIES)
}
