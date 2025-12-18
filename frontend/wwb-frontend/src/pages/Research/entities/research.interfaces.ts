export type ResearchTemplateType = 'template' | 'brief' | 'release' | 'method'

export interface ResearchTemplateSummary {
  id: string
  title: string
  description: string
  type: ResearchTemplateType
  topic: string
  years: string
  criteria: string[]
  lastUpdated: string
  sources: string[]
}

export interface ResearchTemplateResultRow {
  country: string
  region: string
  year: string
  values: Record<string, string | number>
  meetsAllCriteria: boolean
}

export interface ResearchHighlightCountry {
  name: string
  femicideRate: string
  measuresCount: number
}

export interface ResearchTemplateFull extends ResearchTemplateSummary {
  results?: ResearchTemplateResultRow[]
  keyFindings?: string[]
  leaderCountries?: ResearchHighlightCountry[]
  gapCountries?: ResearchHighlightCountry[]
  contentWarning?: string
}

export interface ResearchTemplatesListResponse {
  items: ResearchTemplateSummary[]
}
