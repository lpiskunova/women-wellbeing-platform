export type DocsTabId = 'methodology' | 'limitations' | 'how-to-read' | 'glossary'

export interface DocsTab {
  id: DocsTabId
  label: string
}

export interface GlossaryItem {
  term: string
  definition: string
}
