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

export interface HeroCopy {
  title: string
  description: string
  primaryCtaLabel: string
  primaryCtaHref: string
  secondaryCtaLabel: string
  secondaryCtaHref: string
  sensitiveMessage: string
}

export interface SectionCopy {
  title: string
  subtitle: string
}

export interface DisclaimerCopy {
  title: string
  description: string
}
