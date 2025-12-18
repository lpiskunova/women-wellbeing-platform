export type SortKey = 'name' | 'updated'

export const SORT_OPTIONS: Array<{ value: SortKey; label: string }> = [
  { value: 'name', label: 'Sort by Name' },
  { value: 'updated', label: 'Sort by Updated' },
]

export const DOMAIN_LABELS: Record<string, string> = {
  LAW_INST: 'Legal Rights',
  SAFETY_VIOLENCE: 'Safety & Violence',
  ECONOMIC_PARTICIPATION: 'Economic Participation',
  EDUCATION: 'Education',
  HEALTH: 'Health',
  POLITICAL_REPRESENT: 'Political Representation',
  WPS: 'Women, Peace & Security',
}

export const DOMAIN_VARIANTS: Record<string, 'rights' | 'safety' | 'economy' | 'education' | 'health' | 'representation' | 'other'> = {
  LAW_INST: 'rights',
  SAFETY_VIOLENCE: 'safety',
  ECONOMIC_PARTICIPATION: 'economy',
  EDUCATION: 'education',
  HEALTH: 'health',
  POLITICAL_REPRESENT: 'representation',
  WPS: 'representation',
}
