import type { DocsTab, GlossaryItem } from './docs.interfaces'

export const DOCS_TABS: DocsTab[] = [
  { id: 'methodology', label: 'Methodology' },
  { id: 'limitations', label: 'Limitations' },
  { id: 'how-to-read', label: 'How to Read' },
  { id: 'glossary', label: 'Glossary' },
]

export const METHODOLOGY_SOURCES: Array<{ name: string; description: string }> = [
  {
    name: 'World Bank WBL',
    description:
      "Legal frameworks affecting women's economic participation across 190 countries, updated annually.",
  },
  {
    name: 'GIWPS WPS Index',
    description:
      "Composite measure of women's peace and security across 170 countries, updated biennially.",
  },
  {
    name: 'UN Women',
    description:
      'Gender statistics covering education, health, and political representation globally.',
  },
  {
    name: 'UNODC',
    description:
      'Crime and criminal justice statistics including gender-based violence data for 195 countries.',
  },
]

export const LIMITATIONS_COVERAGE: string[] = [
  'Not all countries report data for all indicators. Coverage varies by indicator and year.',
  'Conflict zones and failed states often have incomplete or outdated data.',
  'Violence data relies on official reporting, which may undercount actual prevalence.',
]

export const LIMITATIONS_METHOD: string[] = [
  'Legal frameworks (WBL) measure de jure rights, not de facto implementation.',
  'Self-reported survey data (IPV) may underestimate true prevalence due to stigma.',
  'Cross-country comparisons assume equivalent measurement standards.',
]

export const GLOSSARY: GlossaryItem[] = [
  {
    term: 'WBL (Women, Business and the Law)',
    definition:
      'World Bank index measuring legal rights across eight areas: mobility, workplace, pay, marriage, parenthood, entrepreneurship, assets, and pension.',
  },
  {
    term: 'GIWPS (Georgetown Institute for Women, Peace and Security)',
    definition:
      'Organization producing the Women, Peace and Security Index measuring inclusion, justice, and security for women globally.',
  },
  {
    term: 'IPV (Intimate Partner Violence)',
    definition: 'Physical, sexual, or psychological harm by a current or former partner or spouse.',
  },
  {
    term: 'Femicide',
    definition:
      'Intentional killing of women because they are women, often by intimate partners or family members.',
  },
  {
    term: 'Coverage Score',
    definition:
      'Percentage of indicators with available data for a given country. Higher scores indicate more complete data coverage.',
  },
  {
    term: 'Freshness Score',
    definition:
      'Measure of how recent the available data is. Higher scores indicate more up-to-date information.',
  },
]

export const PRIVACY_ETHICS_TEXT =
  'This platform displays only aggregated, country-level statistics. No personally identifiable information (PII) is collected, stored, or displayed. All data is from public, reputable international organizations. Sensitive topics are handled with dignity and without sensationalism.'
