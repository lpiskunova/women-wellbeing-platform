import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  Filter,
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  RotateCcw,
} from 'lucide-react'
import { Select } from '@/components/ui/select/Select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card/Card'
import { Button } from '@/components/ui/button/Button'
import { Badge } from '@/components/ui/badge/Badge'
import { Input } from '@/components/ui/input/Input'
import { Checkbox } from '@/components/ui/checkbox/Checkbox'

import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { fetchIndicators } from '@/app/store/indicatorsSlice'

import type { Indicator, NamedRef } from '@/entities/indicator/indicator.interfaces'
import { getRefName, getIndicatorPolarity, formatCoverage } from '@/entities/indicator/indicator.utils'
import { DOMAIN_LABELS, DOMAIN_VARIANTS, SORT_OPTIONS, type SortKey } from './entities/discover.constants'
import styles from './DiscoverPage.module.scss'

function normalize(s: string) {
  return s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim()
}

function getRefCode(ref: NamedRef | undefined): string {
  if (!ref) return ''
  if (typeof ref === 'string') return ''
  return ref.code ?? ''
}

function getDomainKey(ind: Indicator): string {
  const code = getRefCode(ind.domain)
  if (code) return code
  const name = getRefName(ind.domain)
  return name ? `name:${normalize(name)}` : ''
}

function getDomainLabel(ind: Indicator): string {
  const code = getRefCode(ind.domain)
  if (code && DOMAIN_LABELS[code]) return DOMAIN_LABELS[code]

  const name = getRefName(ind.domain)
  return name
}

function getDomainVariant(ind: Indicator): string {
  const code = getRefCode(ind.domain)
  return (code && DOMAIN_VARIANTS[code]) ? DOMAIN_VARIANTS[code] : 'other'
}

function formatUnit(ind: Indicator): string {
  const u = getRefName(ind.unit)
  return u || '—'
}

function formatSource(ind: Indicator): string {
  const s = getRefName(ind.source)
  return s || '—'
}

function getLastUpdated(ind: Indicator): string {
  if (typeof ind.latestYear === 'number') return String(ind.latestYear)
  if (typeof ind.updateYear === 'number') return String(ind.updateYear)

  if (ind.lastUpdated) {
    const d = new Date(ind.lastUpdated)
    if (!Number.isNaN(d.getTime())) return String(d.getFullYear())
  }
  return '—'
}

function IndicatorCard({ ind }: { ind: Indicator }) {
  const polarity = getIndicatorPolarity(ind)
  const isHigherBetter = polarity === 'HIGHER_IS_BETTER'
  const isLowerBetter = polarity === 'LOWER_IS_BETTER'

  const dLabel = getDomainLabel(ind)
  const dVar = getDomainVariant(ind)

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
            </div>

            <div className={styles.polarityRow}>
              <span
                className={[
                  styles.polarityPill,
                  isHigherBetter ? styles.higher : '',
                  isLowerBetter ? styles.lower : '',
                  !isHigherBetter && !isLowerBetter ? styles.neutral : '',
                ].join(' ')}
              >
                {isHigherBetter ? <TrendingUp size={14} /> : null}
                {isLowerBetter ? <TrendingDown size={14} /> : null}
                {isHigherBetter ? 'Higher is better' : isLowerBetter ? 'Lower is better' : 'Polarity: —'}
              </span>

              <span className={styles.updatedText}>
                <span className={styles.updatedLabel}>Last updated:</span> {lastUpdated}
              </span>
            </div>

            {ind.description ? (
              <CardDescription className={styles.desc}>{ind.description}</CardDescription>
            ) : null}
          </div>

          {dLabel ? (
            <Badge className={`${styles.domainBadge} ${styles[`domain_${dVar}`]}`}>
              {dLabel}
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
  const { items, total, status, error } = useAppSelector((s) => s.indicators)

  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortKey>('name')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedDomains, setSelectedDomains] = useState<string[]>([])

  useEffect(() => {
    if (status === 'idle') dispatch(fetchIndicators())
  }, [dispatch, status])

  const domainOptions = useMemo(() => {
    const map = new Map<string, { key: string; label: string }>()
    for (const ind of items as Indicator[]) {
      const key = getDomainKey(ind)
      const label = getDomainLabel(ind)
      if (!key || !label) continue
      if (!map.has(key)) map.set(key, { key, label })
    }
    return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label))
  }, [items])

  const hasActiveFilters = searchQuery.trim() !== '' || selectedDomains.length > 0

  const filtered = useMemo(() => {
    const q = normalize(searchQuery)
    const selected = new Set(selectedDomains)

    let res = items as Indicator[]

    if (q) {
      res = res.filter((i) => normalize(`${i.name} ${i.description ?? ''}`).includes(q))
    }

    if (selected.size > 0) {
      res = res.filter((i) => selected.has(getDomainKey(i)))
    }

    const sorted = [...res]
    if (sortBy === 'name') {
      sorted.sort((a, b) => a.name.localeCompare(b.name))
    } else {
      sorted.sort((a, b) => {
        const aY = Number(getLastUpdated(a)) || 0
        const bY = Number(getLastUpdated(b)) || 0
        return bY - aY || a.name.localeCompare(b.name)
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
                    onChange={(e) => setSearchQuery(e.target.value)}
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
                    variant="outline"
                    onClick={() => setShowFilters((v) => !v)}
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
                    {domainOptions.map((d) => {
                      const checked = selectedDomains.includes(d.key)
                      return (
                        <Checkbox
                          key={d.key}
                          label={d.label}
                          checked={checked}
                          onChange={(next) => {
                            setSelectedDomains((prev) => {
                              if (next && !prev.includes(d.key)) return [...prev, d.key]
                              if (!next && prev.includes(d.key)) return prev.filter((x) => x !== d.key)
                              return prev
                            })
                          }}
                        />
                      )
                    })}
                  </div>

                  {selectedDomains.length > 0 ? (
                    <Button
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
          <div className={`${styles.resultsPill} ${hasActiveFilters ? styles.resultsPillActive : ''}`}>
            <Search size={14} />
            <span>
              Showing <strong>{showing}</strong> of {all} indicators
            </span>
          </div>
        </div>

        <div className={styles.list}>
          {status === 'loading'
            ? Array.from({ length: 6 }).map((_, idx) => (
                <Card key={idx} className={styles.skeletonCard}>
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
                <Button onClick={() => dispatch(fetchIndicators())}>Retry</Button>
              </CardContent>
            </Card>
          ) : null}

          {status === 'succeeded' && filtered.length === 0 ? (
            <Card className={styles.emptyCard}>
              <CardContent className={styles.emptyContent}>
                <p className={styles.emptyText}>No indicators found matching your search criteria.</p>
                <Button
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

          {status === 'succeeded' ? filtered.map((ind) => <IndicatorCard key={ind.code} ind={ind} />) : null}
        </div>
      </div>
    </div>
  )
}
