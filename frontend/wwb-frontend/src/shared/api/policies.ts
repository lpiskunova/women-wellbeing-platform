import { http } from '@/shared/api/http'

export type PolicyItem = {
  id: number
  location_iso3: string | null
  country: string
  year: number | null
  form_of_violence: string | null
  measure_type: string | null
  title: string | null
}

export type PoliciesResponse = {
  items: PolicyItem[]
}

export type PoliciesQuery = {
  locationIso3?: string
  yearFrom?: number
  yearTo?: number
  formOfViolence?: string
  measureType?: string
}

export async function getPolicies(params?: PoliciesQuery): Promise<PoliciesResponse> {
  const res = await http.get<PoliciesResponse>('/policies', {
    params,
  })
  return res.data
}
