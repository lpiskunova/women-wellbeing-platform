import type { LucideIcon } from 'lucide-react'

export type Accent = 'purple' | 'plum' | 'pink' | 'violet'

export interface FeatureItem {
  icon: LucideIcon
  title: string
  description: string
  href: string
  color: Accent
}

export interface DataSourceItem {
  name: string
  coverage: string
  updated: string
  color: Accent
  description?: string
}

export interface AudienceItem {
  icon: LucideIcon
  title: string
  description: string
  color: Accent
}
