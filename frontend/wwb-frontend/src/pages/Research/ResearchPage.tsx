import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  BarChart3,
  CheckCircle2,
  Download,
  ExternalLink,
  Search,
  SlidersHorizontal,
  XCircle,
} from 'lucide-react'
import styles from './ResearchPage.module.scss'
import { Select } from '@/components/ui/select/Select'
import { Button } from '@/components/ui/button/Button'
import { Badge } from '@/components/ui/badge/Badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card/Card'
import {
  BRIEF_DATA_MODEL_NOTE_BY_ID,
  DEFAULT_RESEARCH_TOPICS,
  RESEARCH_REGION_OPTIONS,
  RESEARCH_SORT_OPTIONS,
  RESEARCH_TYPE_OPTIONS,
  getTopicTone,
  type SelectOption,
} from './entities/research.constants'
import type {
  ResearchTemplateFull,
  ResearchTemplateResultRow,
  ResearchTemplateSummary,
  ResearchTemplateType,
} from './entities/research.interfaces'
import {
  getResearchTemplates,
  getResearchTemplateById,
  type ResearchTemplateSummary as ApiResearchTemplateSummary,
  type ResearchTemplateResult as ApiResearchTemplateResult,
} from '@/shared/api/research'
import { useApi } from '@/shared/hooks/useApi'
import { AppErrorBoundary } from '@/app/providers/AppErrorBoundary'
import { getErrorMessage } from '@/shared/api/apiError'

function escapeCsv(value: unknown) {
  const s = String(value ?? '')
  if (/[",\n]/.test(s)) return `"${s.replaceAll('"', '""')}"`
  return s
}

function toYearNumber(value: string) {
  const n = Number.parseInt(value, 10)
  return Number.isFinite(n) ? n : 0
}

type SelectFieldProps = {
  label: string
  value: string
  options: ReadonlyArray<SelectOption>
  onChange: (next: string) => void
}

function SelectField({ label, value, options, onChange }: SelectFieldProps) {
  return (
    <div>
      <label className={styles.fieldLabel}>{label}</label>
      <Select<string>
        value={value}
        options={options}
        onValueChange={onChange}
        className={styles.selectRoot}
        triggerClassName={styles.selectTrigger}
        ariaLabel={label}
      />
    </div>
  )
}

function MetaFooter({ t }: { t: ResearchTemplateSummary }) {
  return (
    <div className={styles.metaFooter}>
      <span>
        <strong>Last Updated:</strong> {t.lastUpdated}
      </span>
      <span>
        <strong>Years:</strong> {t.years}
      </span>
      <span>
        <strong>Sources:</strong> {t.sources.join(', ')}
      </span>

      <Link className={styles.footerLink} to="/docs#methodology">
        Methodology <ExternalLink size={14} />
      </Link>
      <Link className={styles.footerLink} to="/docs#limitations">
        Limitations <ExternalLink size={14} />
      </Link>
      <Link className={styles.footerLink} to="/docs#how-to-read">
        How to Read <ExternalLink size={14} />
      </Link>
    </div>
  )
}

function TemplateTable({
  templateId,
  results,
}: {
  templateId: string
  results: ResearchTemplateResultRow[]
}) {
  const first = results[0]
  const valueKeys = Object.keys(first?.values ?? {})

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th>Rank</th>
            <th>Country</th>
            <th>Region</th>
            <th>Year</th>
            {valueKeys.map((k) => (
              <th key={k} className={styles.right}>
                {k}
              </th>
            ))}
            <th className={styles.center}>Status</th>
            <th className={styles.right}>Actions</th>
          </tr>
        </thead>

        <tbody className={styles.tbody}>
          {results.map((r, idx) => (
            <tr key={`${templateId}-${r.country}`}>
              <td className={styles.muted}>#{idx + 1}</td>
              <td>
                <strong>{r.country}</strong>
              </td>
              <td>
                <Badge variant="subtle" className={styles.regionBadge}>
                  {r.region}
                </Badge>
              </td>
              <td className={styles.muted}>{r.year}</td>

              {valueKeys.map((k) => (
                <td key={k} className={styles.right}>
                  <strong>{r.values[k]}</strong>
                </td>
              ))}

              <td className={styles.center}>
                {r.meetsAllCriteria ? (
                  <Badge variant="subtle" className={styles.metBadge}>
                    <CheckCircle2 size={14} />
                    Met
                  </Badge>
                ) : (
                  <Badge variant="subtle" className={styles.notMetBadge}>
                    <XCircle size={14} />
                    Not met
                  </Badge>
                )}
              </td>

              <td className={styles.right}>
                <Button variant="ghost" size="sm" asChild>
                  <Link to={`/countries?country=${encodeURIComponent(r.country)}`}>
                    View <ExternalLink size={14} />
                  </Link>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function mapSummaryFromApi(api: ApiResearchTemplateSummary): ResearchTemplateSummary {
  return {
    id: api.id,
    title: api.title,
    description: api.description,
    type: api.type as ResearchTemplateType,
    topic: api.topic,
    years: api.years,
    criteria: api.criteria,
    lastUpdated: api.lastUpdated,
    sources: api.sources,
  }
}

function mapFullFromApi(api: ApiResearchTemplateResult): ResearchTemplateFull {
  return {
    id: api.id,
    title: api.title,
    description: api.description,
    type: api.type as ResearchTemplateType,
    topic: api.topic,
    years: api.years,
    criteria: api.criteria,
    lastUpdated: api.lastUpdated,
    sources: api.sources,
    results: api.results?.map((r) => ({
      country: r.country,
      region: r.region,
      year: r.year,
      values: r.values,
      meetsAllCriteria: r.meetsAllCriteria,
    })),
    keyFindings: api.keyFindings ?? undefined,
    leaderCountries: api.leaderCountries?.map((c) => ({
      name: c.name,
      femicideRate: c.femicideRate,
      measuresCount: c.measuresCount,
    })),
    gapCountries: api.gapCountries?.map((c) => ({
      name: c.name,
      femicideRate: c.femicideRate,
      measuresCount: c.measuresCount,
    })),
    contentWarning: api.contentWarning ?? undefined,
  }
}

export function ResearchPageInner() {
  const navigate = useNavigate()

  const { data: templatesList, loading, error, refetch } = useApi(getResearchTemplates)

  const items: ResearchTemplateSummary[] = useMemo(
    () => (templatesList ? templatesList.items.map(mapSummaryFromApi) : []),
    [templatesList],
  )

  const [detailsById, setDetailsById] = useState<Record<string, ResearchTemplateFull | undefined>>(
    {},
  )

  const [detailsError, setDetailsError] = useState<string | null>(null)

  const [sortBy, setSortBy] = useState('newest')
  const [filterTopic, setFilterTopic] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [filterRegion, setFilterRegion] = useState('all')

  const hasActiveFilters = filterTopic !== 'all' || filterType !== 'all' || filterRegion !== 'all'

  const resetFilters = () => {
    setFilterTopic('all')
    setFilterType('all')
    setFilterRegion('all')
    setSortBy('newest')
  }

  useEffect(() => {
    if (!templatesList || !templatesList.items.length) return

    const list = templatesList
    let cancelled = false

    async function loadDetails() {
      try {
        setDetailsError(null)

        const settled = await Promise.allSettled(
          list.items.map((it) => getResearchTemplateById(it.id)),
        )
        if (cancelled) return

        setDetailsById((prev) => {
          const next = { ...prev }
          for (const s of settled) {
            if (s.status === 'fulfilled') {
              const full = mapFullFromApi(s.value)
              next[full.id] = full
            }
          }
          return next
        })
      } catch (e) {
        if (!cancelled) {
          setDetailsError(getErrorMessage(e))
        }
      }
    }

    void loadDetails()

    return () => {
      cancelled = true
    }
  }, [templatesList, setDetailsError])

  const topicOptions = useMemo<SelectOption[]>(() => {
    const fromApi = new Set(items.map((i) => i.topic).filter(Boolean))
    const ordered = [
      ...DEFAULT_RESEARCH_TOPICS,
      ...[...fromApi].filter((t) => !DEFAULT_RESEARCH_TOPICS.includes(t)),
    ]

    return [{ value: 'all', label: 'All Topics' }, ...ordered.map((t) => ({ value: t, label: t }))]
  }, [items])

  const filtered = useMemo(() => {
    const base = items.filter((it) => {
      const t = detailsById[it.id] ?? it

      if (filterTopic !== 'all' && t.topic !== filterTopic) return false
      if (filterType !== 'all' && t.type !== filterType) return false

      if (filterRegion !== 'all') {
        const full = detailsById[it.id]
        if (full?.results && full.results.length > 0) {
          if (!full.results.some((r) => r.region === filterRegion)) return false
        }
      }

      return true
    })

    const sorted = [...base].sort((a, b) => {
      const A = detailsById[a.id] ?? a
      const B = detailsById[b.id] ?? b

      if (sortBy === 'a-z') return A.title.localeCompare(B.title)

      const an = toYearNumber(A.lastUpdated)
      const bn = toYearNumber(B.lastUpdated)
      if (bn !== an) return bn - an
      return B.title.localeCompare(A.title)
    })

    return sorted
  }, [items, detailsById, filterTopic, filterType, filterRegion, sortBy])

  const exportCsv = (t: ResearchTemplateFull) => {
    if (!t.results || t.results.length === 0) return

    const valueKeys = Object.keys(t.results[0]?.values ?? {})
    const header = ['Country', 'Region', 'Year', ...valueKeys, 'Meets All Criteria']

    const rows = t.results.map((r) => [
      r.country,
      r.region,
      r.year,
      ...valueKeys.map((k) => r.values[k]),
      r.meetsAllCriteria ? 'Yes' : 'No',
    ])

    const csv = [header, ...rows].map((row) => row.map(escapeCsv).join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = `${t.id}.csv`
    a.click()

    URL.revokeObjectURL(url)
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <header className={styles.head}>
          <h1 className={styles.title}>Research — Findings &amp; Templates</h1>
          <p className={styles.subtitle}>
            Curated insights beyond country lists. Explore preset analyses, interactive templates,
            briefs, data releases, and methodology notes with full transparency.
          </p>
        </header>

        <section className={styles.filtersCard}>
          <div className={styles.filtersTop}>
            <div className={styles.filtersLabel}>
              <SlidersHorizontal size={16} />
              <span>Filter analyses</span>
            </div>
          </div>

          <div className={styles.filtersGrid}>
            <SelectField
              label="Topic/Domain"
              value={filterTopic}
              options={topicOptions}
              onChange={setFilterTopic}
            />
            <SelectField
              label="Type"
              value={filterType}
              options={RESEARCH_TYPE_OPTIONS}
              onChange={setFilterType}
            />
            <SelectField
              label="Region"
              value={filterRegion}
              options={RESEARCH_REGION_OPTIONS}
              onChange={setFilterRegion}
            />
            <SelectField
              label="Sort By"
              value={sortBy}
              options={RESEARCH_SORT_OPTIONS}
              onChange={setSortBy}
            />
          </div>

          <div className={styles.filtersBottom}>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                Reset filters
              </Button>
            )}
          </div>
        </section>

        <div className={styles.resultsRow}>
          <div
            className={`${styles.resultsPill} ${hasActiveFilters ? styles.resultsPillActive : ''}`}
          >
            <Search size={14} />
            <span className={styles.showingChip}>
              Showing <strong>{filtered.length}</strong> of {items.length || '—'} analyses
            </span>
          </div>
        </div>

        {error && (
          <Card className={styles.statusCard}>
            <CardHeader>
              <CardTitle className={styles.statusTitle}>Research</CardTitle>
              <CardDescription className={styles.statusText}>{detailsError}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" onClick={() => void refetch()}>
                Retry
              </Button>
            </CardContent>
          </Card>
        )}

        {!error && loading && items.length === 0 && (
          <Card className={styles.statusCard}>
            <CardHeader>
              <CardTitle className={styles.statusTitle}>Loading…</CardTitle>
              <CardDescription className={styles.statusText}>
                Fetching research templates.
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        <div className={styles.list}>
          {filtered.map((summary) => {
            const full = detailsById[summary.id]
            const t: ResearchTemplateSummary | ResearchTemplateFull = full ?? summary

            const tone = getTopicTone(t.topic)
            const topicClass =
              tone === 'default' ? styles['topic-default'] : styles[`topic-${tone}`]

            const isBrief = t.type === 'brief'

            const visibleResults =
              full?.results && filterRegion !== 'all'
                ? full.results.filter((r) => r.region === filterRegion)
                : full?.results

            return (
              <Card key={t.id} className={styles.card}>
                <CardHeader className={styles.cardHeader}>
                  <div className={styles.cardTop}>
                    <div className={styles.cardMain}>
                      <div className={styles.badgesRow}>
                        <CardTitle className={styles.cardTitle}>{t.title}</CardTitle>

                        <Badge variant="subtle" className={styles.tag}>
                          {t.type === 'template'
                            ? 'Template'
                            : t.type === 'brief'
                              ? 'Brief'
                              : t.type}
                        </Badge>

                        <Badge variant="subtle" className={topicClass}>
                          {t.topic}
                        </Badge>
                      </div>

                      <CardDescription className={styles.cardDescription}>
                        {t.description}
                      </CardDescription>

                      <div className={styles.criteriaBlock}>
                        <p className={styles.criteriaLabel}>Criteria:</p>
                        <div className={styles.criteriaChips}>
                          {t.criteria.map((c) => (
                            <Badge key={c} variant="subtle" className={styles.criterionBadge}>
                              {c}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className={styles.actions}>
                      {!isBrief && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => full && exportCsv(full)}
                          disabled={!full?.results || full.results.length === 0}
                        >
                          <Download size={16} />
                          Export CSV
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/discover?research=${encodeURIComponent(t.id)}`)}
                      >
                        <BarChart3 size={16} />
                        Explore data
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className={styles.cardContent}>
                  {isBrief && (
                    <div className={styles.briefGrid}>
                      <div>
                        <p className={styles.sectionTitle}>Key findings</p>

                        {!full?.keyFindings ? (
                          <p className={styles.muted}>Loading details…</p>
                        ) : (
                          <ul className={styles.findings}>
                            {full.keyFindings.map((f) => (
                              <li key={f} className={styles.findingItem}>
                                <CheckCircle2 size={16} className={styles.findingIcon} />
                                <span>{f}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        {BRIEF_DATA_MODEL_NOTE_BY_ID[t.id] && (
                          <div className={styles.modelBox}>
                            <p className={styles.modelTitle}>How this brief uses data model</p>
                            <p style={{ margin: 0 }}>{BRIEF_DATA_MODEL_NOTE_BY_ID[t.id]}</p>
                          </div>
                        )}

                        {full?.contentWarning && (
                          <p className={styles.contentNote}>{full.contentWarning}</p>
                        )}
                      </div>

                      <div className={styles.sideColumn}>
                        <div className={styles.sideBoxGreen}>
                          <p className={styles.sideTitleGreen}>Countries meeting both criteria</p>

                          {!full?.leaderCountries ? (
                            <p className={styles.muted} style={{ margin: '10px 0 0' }}>
                              Loading…
                            </p>
                          ) : (
                            <div className={styles.sideList}>
                              {full.leaderCountries.map((c) => (
                                <div key={c.name} className={styles.sideRow}>
                                  <span className={styles.sideName}>{c.name}</span>
                                  <span className={styles.sideBadges}>
                                    <Badge variant="subtle" className={styles.sideBadgeGreen}>
                                      {c.femicideRate} per 100k
                                    </Badge>
                                    <Badge variant="subtle" className={styles.sideBadgeGreen}>
                                      {c.measuresCount}+ measures
                                    </Badge>
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className={styles.sideBoxRed}>
                          <p className={styles.sideTitleRed}>High rates, limited measures</p>

                          {!full?.gapCountries ? (
                            <p className={styles.muted} style={{ margin: '10px 0 0' }}>
                              Loading…
                            </p>
                          ) : (
                            <div className={styles.sideList}>
                              {full.gapCountries.map((c) => (
                                <div key={c.name} className={styles.sideRow}>
                                  <span className={styles.sideName}>{c.name}</span>
                                  <span className={styles.sideBadges}>
                                    <Badge variant="subtle" className={styles.sideBadgeRed}>
                                      {c.femicideRate} per 100k
                                    </Badge>
                                    <Badge variant="subtle" className={styles.sideBadgeRed}>
                                      {c.measuresCount} measure
                                      {c.measuresCount !== 1 ? 's' : ''}
                                    </Badge>
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {!isBrief && (
                    <>
                      {!visibleResults ? (
                        <p className={styles.muted} style={{ marginTop: 14 }}>
                          Loading table…
                        </p>
                      ) : visibleResults.length === 0 ? (
                        <p className={styles.muted} style={{ marginTop: 14 }}>
                          No results for selected region.
                        </p>
                      ) : (
                        <TemplateTable templateId={t.id} results={visibleResults} />
                      )}
                    </>
                  )}

                  <MetaFooter t={t} />
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export function ResearchPage() {
  return (
    <AppErrorBoundary>
      <ResearchPageInner />
    </AppErrorBoundary>
  )
}
