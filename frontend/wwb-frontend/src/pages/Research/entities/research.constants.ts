export type SelectOption = { value: string; label: string }

export const RESEARCH_TYPE_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'All Types' },
  { value: 'template', label: 'Template' },
  { value: 'brief', label: 'Brief' },
  { value: 'release', label: 'Data Release' },
  { value: 'method', label: 'Method Note' },
]

export const RESEARCH_REGION_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'All Regions' },
  { value: 'Africa', label: 'Africa' },
  { value: 'Americas', label: 'Americas' },
  { value: 'Asia', label: 'Asia' },
  { value: 'Europe', label: 'Europe' },
  { value: 'Oceania', label: 'Oceania' },
]

export const RESEARCH_SORT_OPTIONS: SelectOption[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'a-z', label: 'A → Z' },
]

export const DEFAULT_RESEARCH_TOPICS: string[] = [
  'Economic Participation',
  'Health',
  'Legal Rights',
  'Safety & Violence',
  'Education',
  'Political Representation',
]

export type TopicTone = 'economic' | 'health' | 'legal' | 'safety' | 'default'

export function getTopicTone(topic: string): TopicTone {
  if (topic === 'Economic Participation') return 'economic'
  if (topic === 'Health') return 'health'
  if (topic === 'Legal Rights') return 'legal'
  if (topic === 'Safety & Violence') return 'safety'
  return 'default'
}

export const BRIEF_DATA_MODEL_NOTE_BY_ID: Record<string, string> = {
  'femicide-policy-brief':
    'Combines femicide rates from indicator_observations (UNODC) with measures from policy_records (UN Women VAW) and metadata from data_sources.',
}
