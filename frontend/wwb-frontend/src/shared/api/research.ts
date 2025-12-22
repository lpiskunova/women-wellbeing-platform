import { http } from '@/shared/api/http'

export type ResearchTemplateSummary = {
  id: string
  title: string
  description: string
  type: 'template' | 'brief' | 'release' | 'method' | string
  topic: string
  years: string
  criteria: string[]
  lastUpdated: string
  sources: string[]
}

export type ResearchTemplatesList = {
  items: ResearchTemplateSummary[]
}

export type ResearchTemplateResult = {
  id: string
  title: string
  description: string
  type: string
  topic: string
  years: string
  criteria: string[]
  lastUpdated: string
  sources: string[]
  results?: Array<{
    country: string
    region: string
    year: string
    values: Record<string, number | string>
    meetsAllCriteria: boolean
  }>
  keyFindings?: string[] | null
  leaderCountries?: Array<{
    name: string
    femicideRate: string
    measuresCount: number
  }> | null
  gapCountries?: Array<{
    name: string
    femicideRate: string
    measuresCount: number
  }> | null
  contentWarning?: string | null
}

export async function getResearchTemplates(): Promise<ResearchTemplatesList> {
  const res = await http.get<ResearchTemplatesList>('/research/templates')
  return res.data
}

export async function getResearchTemplateById(id: string): Promise<ResearchTemplateResult> {
  const res = await http.get<ResearchTemplateResult>(`/research/templates/${id}`)
  return res.data
}
