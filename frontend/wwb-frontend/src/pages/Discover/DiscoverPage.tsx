import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, ArrowUpDown, TrendingUp, TrendingDown, RotateCcw } from 'lucide-react'
import { Select } from '@/components/ui/select/Select'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card/Card'
import { Button } from '@/components/ui/button/Button'
import { Badge } from '@/components/ui/badge/Badge'
import { Input } from '@/components/ui/input/Input'
import { Checkbox } from '@/components/ui/checkbox/Checkbox'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { fetchIndicators } from '@/app/store/indicatorsSlice'
import type { Indicator, NamedRef } from '@/entities/indicator/indicator.interfaces'
import {
  getRefName,
  getIndicatorPolarity,
  formatCoverage,
} from '@/entities/indicator/indicator.utils'
import {
  DOMAIN_LABELS,
  DOMAIN_VARIANTS,
  SORT_OPTIONS,
  type SortKey,
  type DomainVariant,
} from './entities/discover.constants'
import styles from './DiscoverPage.module.scss'

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
}

function getRefCode(ref: NamedRef | undefined): string {
  if (!ref) return ''
  if (typeof ref === 'string') return ''
  return ref.code ?? ''
}

function getDomainKey(indicator: Indicator): string {
  const code = getRefCode(indicator.domain)
  if (code) return code

  const name = getRefName(indicator.domain)
  return name ? `name:${normalize(name)}` : ''
}

function getDomainLabel(indicator: Indicator): string {
  const code = getRefCode(indicator.domain)
  if (code && DOMAIN_LABELS[code]) return DOMAIN_LABELS[code]

  return getRefName(indicator.domain)
}

function getDomainVariant(indicator: Indicator): DomainVariant {
  const code = getRefCode(indicator.domain)
  const variant = code ? DOMAIN_VARIANTS[code] : undefined
  return variant ?? 'other'
}

function formatUnit(indicator: Indicator): string {
  const unit = getRefName(indicator.unit)
  return unit || '—'
}

function formatSource(indicator: Indicator): string {
  const source = getRefName(indicator.source)
  return source || '—'
}

function getLastUpdated(indicator: Indicator): string {
  if (typeof indicator.latestYear === 'number') return String(indicator.latestYear)
  if (typeof indicator.updateYear === 'number') return String(indicator.updateYear)

  if (indicator.lastUpdated) {
    const date = new Date(indicator.lastUpdated)
    if (!Number.isNaN(date.getTime())) return String(date.getFullYear())
  }

  return '—'
}

interface IndicatorCardProps {
  ind: Indicator
}

function IndicatorCard({ ind }: IndicatorCardProps) {
  const polarity = getIndicatorPolarity(ind)
  const isHigherBetter = polarity === 'HIGHER_IS_BETTER'
  const isLowerBetter = polarity === 'LOWER_IS_BETTER'

  const domainLabel = getDomainLabel(ind)
  const domainVariant = getDomainVariant(ind)
  const domainClassName =
    styles[`domain_${domainVariant}` as keyof typeof styles] ?? styles.domain_other

  const coverage = formatCoverage(ind)
  const lastUpdated = getLastUpdated(ind)

  return (
    <Card className={styles.indicatorCard}>
      <div className={styles.topBar} />

      <CardHeader className={styles.cardHeader}>
        <div className={styles.headerRow}>
          <div className={styles.left}>
            <div className={styles.titleRow}>
              <CardTitle className={styles.title}>
                <Link
                  to={`/indicators/${encodeURIComponent(ind.code)}`}
                  className={styles.titleLink}
                >
                  {ind.name}
                </Link>
              </CardTitle>

              {domainLabel ? (
                <Badge
                  className={`${styles.domainBadge} ${styles.domainBadgeMobile} ${domainClassName}`}
                >
                  {domainLabel}
                </Badge>
              ) : null}
            </div>

            <div className={styles.polarityRow}>
              <span
                className={[
                  styles.polarityPill,
                  isHigherBetter ? styles.higher : '',
                  isLowerBetter ? styles.lower : '',
                  !isHigherBetter && !isLowerBetter ? styles.neutral : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {isHigherBetter ? <TrendingUp size={14} /> : null}
                {isLowerBetter ? <TrendingDown size={14} /> : null}
                {isHigherBetter
                  ? 'Higher is better'
                  : isLowerBetter
                    ? 'Lower is better'
                    : 'Polarity: —'}
              </span>

              <span className={styles.updatedText}>
                <span className={styles.updatedLabel}>Last updated:</span> {lastUpdated}
              </span>
            </div>

            {ind.description ? (
              <CardDescription className={styles.desc}>{ind.description}</CardDescription>
            ) : null}
          </div>

          {domainLabel ? (
            <Badge
              className={`${styles.domainBadge} ${styles.domainBadgeDesktop} ${domainClassName}`}
            >
              {domainLabel}
            </Badge>
          ) : null}
        </div>
      </CardHeader>

      <CardContent className={styles.cardFooter}>
        <span className={styles.chip}>
          <span className={styles.chipLabel}>Unit:</span> {formatUnit(ind)}
        </span>

        <span className={styles.chip}>
          <span className={styles.chipLabel}>Source:</span> {formatSource(ind)}
        </span>

        <span className={styles.chip}>
          <span className={styles.chipLabel}>Coverage:</span> {coverage ?? '—'}
        </span>

        <Button asChild variant="ghost" className={styles.viewBtn}>
          <Link to={`/indicators/${encodeURIComponent(ind.code)}`}>View Details →</Link>
        </Button>
      </CardContent>
    </Card>
  )
}

export function DiscoverPage() {
  const dispatch = useAppDispatch()
  const { items, total, status, error } = useAppSelector((state) => state.indicators)

  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortKey>('name')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedDomains, setSelectedDomains] = useState<string[]>([])

  useEffect(() => {
    if (status === 'idle') {
      void dispatch(fetchIndicators())
    }
  }, [dispatch, status])

  const domainOptions = useMemo(() => {
    const map = new Map<string, { key: string; label: string }>()
    for (const indicator of items as Indicator[]) {
      const key = getDomainKey(indicator)
      const label = getDomainLabel(indicator)
      if (!key || !label) continue
      if (!map.has(key)) map.set(key, { key, label })
    }
    return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label))
  }, [items])

  const hasActiveFilters = searchQuery.trim() !== '' || selectedDomains.length > 0

  const filtered = useMemo(() => {
    const query = normalize(searchQuery)
    const selected = new Set(selectedDomains)

    let result = items as Indicator[]

    if (query) {
      result = result.filter((indicator) =>
        normalize(`${indicator.name} ${indicator.description ?? ''}`).includes(query),
      )
    }

    if (selected.size > 0) {
      result = result.filter((indicator) => selected.has(getDomainKey(indicator)))
    }

    const sorted = [...result]
    if (sortBy === 'name') {
      sorted.sort((a, b) => a.name.localeCompare(b.name))
    } else {
      sorted.sort((a, b) => {
        const yearA = Number(getLastUpdated(a)) || 0
        const yearB = Number(getLastUpdated(b)) || 0
        if (yearA === yearB) return a.name.localeCompare(b.name)
        return yearB - yearA
      })
    }

    return sorted
  }, [items, searchQuery, selectedDomains, sortBy])

  const showing = filtered.length
  const all = total || (items?.length ?? 0)

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.hero}>
          <h1 className={styles.h1}>Data Dictionary</h1>
          <p className={styles.subtitle}>
            Browse all available indicators with descriptions, units, and data sources. Click any
            indicator to explore detailed visualizations.
          </p>
        </div>

        <Card className={styles.controlsCard}>
          <CardContent className={styles.controlsContent}>
            <div className={styles.controlsStack}>
              <div className={styles.controlsRow}>
                <div className={styles.searchField}>
                  <Search className={styles.searchIcon} size={16} />
                  <Input
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search indicators by name or description..."
                    className={styles.searchInput}
                  />
                </div>

                <div className={styles.actions}>
                  <Select<SortKey>
                    value={sortBy}
                    options={SORT_OPTIONS}
                    onValueChange={setSortBy}
                    ariaLabel="Sort indicators"
                    startIcon={<ArrowUpDown size={16} />}
                    triggerClassName={styles.sortTrigger}
                  />

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowFilters((prev) => !prev)}
                    className={`${styles.filtersBtn} ${
                      showFilters || selectedDomains.length > 0 ? styles.filtersBtnActive : ''
                    }`}
                  >
                    <Filter size={16} />
                    <span>Filters</span>
                    {selectedDomains.length > 0 ? (
                      <span className={styles.filtersCount}>{selectedDomains.length}</span>
                    ) : null}
                  </Button>
                </div>
              </div>

              {showFilters ? (
                <div className={styles.filtersPanel}>
                  <h3 className={styles.filtersTitle}>Filter by Domain</h3>

                  <div className={styles.filtersGrid}>
                    {domainOptions.map((domain) => {
                      const checked = selectedDomains.includes(domain.key)
                      return (
                        <Checkbox
                          key={domain.key}
                          label={domain.label}
                          checked={checked}
                          onChange={(nextChecked) => {
                            setSelectedDomains((prev) => {
                              if (nextChecked && !prev.includes(domain.key)) {
                                return [...prev, domain.key]
                              }
                              if (!nextChecked && prev.includes(domain.key)) {
                                return prev.filter((key) => key !== domain.key)
                              }
                              return prev
                            })
                          }}
                        />
                      )
                    })}
                  </div>

                  {selectedDomains.length > 0 ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className={styles.clearBtn}
                      onClick={() => setSelectedDomains([])}
                    >
                      <RotateCcw size={16} />
                      Clear filters
                    </Button>
                  ) : null}
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>

        <div className={styles.resultsRow}>
          <div
            className={`${styles.resultsPill} ${hasActiveFilters ? styles.resultsPillActive : ''}`}
          >
            <Search size={14} />
            <span className={styles.resultsText}>
              Showing {showing} of {all} indicators
            </span>
          </div>
        </div>

        <div className={styles.list}>
          {status === 'loading'
            ? Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className={styles.skeletonCard}>
                  <div className={styles.topBar} />
                </Card>
              ))
            : null}

          {status === 'failed' ? (
            <Card className={styles.errorCard}>
              <CardHeader>
                <CardTitle>Couldn’t load indicators</CardTitle>
                <CardDescription>{error ?? 'Unknown error'}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button type="button" onClick={() => dispatch(fetchIndicators())}>
                  Retry
                </Button>
              </CardContent>
            </Card>
          ) : null}

          {status === 'succeeded' && filtered.length === 0 ? (
            <Card className={styles.emptyCard}>
              <CardContent className={styles.emptyContent}>
                <p className={styles.emptyText}>
                  No indicators found matching your search criteria.
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  className={styles.emptyBtn}
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedDomains([])
                  }}
                >
                  Clear all filters
                </Button>
              </CardContent>
            </Card>
          ) : null}

          {status === 'succeeded'
            ? filtered.map((indicator) => <IndicatorCard key={indicator.code} ind={indicator} />)
            : null}
        </div>
      </div>
    </div>
  )
}
