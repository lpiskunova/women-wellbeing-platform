import type { Indicator, NamedRef, IndicatorPolarity } from "./indicator.interfaces"

export function getRefName(ref?: NamedRef): string {
  if (!ref) return ''
  if (typeof ref === 'string') return ref
  return ref.name ?? ref.code ?? ''
}

export function getRefCode(ref?: NamedRef): string {
  if (!ref) return ''
  if (typeof ref === 'string') return ''
  return ref.code ?? ''
}

export function getIndicatorDomainName(ind: Indicator): string {
  return getRefName(ind.domain)
}

export function getIndicatorSourceName(ind: Indicator): string {
  return getRefName(ind.source)
}

export function getIndicatorPolarity(ind: Indicator): IndicatorPolarity | null {
  if (ind.polarity) return ind.polarity
  if (ind.higherIsBetter === true) return 'HIGHER_IS_BETTER'
  if (ind.higherIsBetter === false) return 'LOWER_IS_BETTER'
  return null
}

export function getIndicatorUpdatedValue(ind: Indicator): number {
  if (typeof ind.latestYear === 'number') return ind.latestYear
  if (typeof ind.updateYear === 'number') return ind.updateYear
  if (ind.lastUpdated) {
    const t = Date.parse(ind.lastUpdated)
    if (!Number.isNaN(t)) return t
  }
  return 0
}

export function formatCoverage(ind: Indicator): string | null {
    const raw = ind.coverageCount as unknown
    const c =
      typeof raw === 'string' ? Number.parseInt(raw, 10) :
      typeof raw === 'number' ? raw :
      null
  
    if (c != null && Number.isFinite(c) && c > 0) return `${c} countries`

    const v = ind.coverage
    if (typeof v !== 'number' || Number.isNaN(v)) return null
    const percent = v <= 1 ? v * 100 : v
    const clamped = Math.max(0, Math.min(100, percent))
    return `${Math.round(clamped)}%`
} 

export function formatUnit(ind: Indicator): string {
    const name = getRefName(ind.unit)
    return name || '—'
}