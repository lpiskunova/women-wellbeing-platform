import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  ArrowUpDown,
  Download,
  Share2,
  ZoomIn,
  ZoomOut,
  ExternalLink,
  AlertTriangle,
} from 'lucide-react'

import { cn } from '@/shared/lib/cn'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { fetchIndicators } from '@/app/store/indicatorsSlice'

import type { Indicator } from '@/entities/indicator/indicator.interfaces'
import {
  formatCoverage,
  formatUnit,
  getIndicatorPolarity,
  getRefCode,
  getRefName,
} from '@/entities/indicator/indicator.utils'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card/Card'
import { Button } from '@/components/ui/button/Button'
import { Badge } from '@/components/ui/badge/Badge'

import styles from './IndicatorPage.module.scss'

type RankingsApiResponse = {
  indicator: {
    code: string
    name: string
    description?: string | null
    higher_is_better: boolean
    domain: { code: string; name: string }
    unit: { code: string; name: string; symbol?: string | null }
  }
  latestYear: number | null
  items: Array<{
    rank: number
    location: {
      iso3: string
      name: string
      region?: string | null
      incomeGroup?: string | null
    }
    year: number
    value: number | null
  }>
}

type RankingRow = { country: string; value: number | null; rank?: number }
type TimeRow = { year: number; value: number | null }

const MOCK_TS: TimeRow[] = [
  { year: 2014, value: 85.3 },
  { year: 2015, value: 86.1 },
  { year: 2016, value: null },
  { year: 2017, value: 88.5 },
  { year: 2018, value: 89.2 },
  { year: 2019, value: 90.1 },
  { year: 2020, value: 90.8 },
  { year: 2021, value: null },
  { year: 2022, value: 91.3 },
  { year: 2023, value: 91.3 },
  { year: 2024, value: 91.3 },
]

function fmt(v: number) {
  return v.toLocaleString(undefined, { maximumFractionDigits: 1 })
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    alert('Link copied to clipboard!')
  } catch {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.position = 'fixed'
    ta.style.left = '-9999px'
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
    alert('Link copied to clipboard!')
  }
}

function domainLabel(ind: Indicator) {
  return getRefName(ind.domain) || '—'
}

function getUpdated(ind: Indicator) {
  if (typeof ind.latestYear === 'number') return String(ind.latestYear)
  if (typeof ind.updateYear === 'number') return String(ind.updateYear)
  if (ind.lastUpdated) {
    const t = Date.parse(ind.lastUpdated)
    if (!Number.isNaN(t)) return String(new Date(t).getFullYear())
  }
  return '—'
}

type TabKey = 'ranking' | 'trends' | 'map'

function MetadataFooter({ source, updated }: { source: string; updated: string }) {
  return (
    <div className={styles.metaFooter}>
      <div className={styles.metaLeft}>
        <span>
          <strong>Source:</strong> {source}
        </span>
        <span>
          <strong>Updated:</strong> {updated}
        </span>
      </div>
      <div className={styles.metaLinks}>
        <Link to="/docs#methodology" className={styles.metaLink}>
          Methodology <ExternalLink size={14} />
        </Link>
        <Link to="/docs#limitations" className={styles.metaLink}>
          Limitations <ExternalLink size={14} />
        </Link>
        <Link to="/docs#how-to-read" className={styles.metaLink}>
          How to read <ExternalLink size={14} />
        </Link>
      </div>
    </div>
  )
}

function RankingCard({
  data,
  unitLabel,
  selectedCountry,
  onSelect,
  source,
  updated,
}: {
  data: RankingRow[]
  unitLabel: string
  selectedCountry?: string
  onSelect: (c: string) => void
  source: string
  updated: string
}) {
  const [asc, setAsc] = useState(false)

  const sorted = useMemo(() => {
    const rows = [...data]
    rows.sort((a, b) => {
      const aNo = a.value == null
      const bNo = b.value == null
      if (aNo && !bNo) return 1
      if (!aNo && bNo) return -1
      if (a.value == null || b.value == null) return 0
      return asc ? a.value - b.value : b.value - a.value
    })
    return rows
  }, [data, asc])

  const max = useMemo(() => {
    const vals = data.map((d) => d.value).filter((v): v is number => typeof v === 'number')
    return vals.length ? Math.max(...vals) : 1
  }, [data])

  const exportCsv = () => {
    const csv = [
      ['Rank', 'Country', 'Value', 'Unit'],
      ...sorted.map((r) => [r.rank ?? '—', r.country, r.value ?? 'No data', unitLabel]),
    ]
      .map((row) => row.join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'ranking.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const share = async () => {
    await copyToClipboard(window.location.href)
  }

  return (
    <Card className={styles.vizCard}>
      <CardHeader className={styles.vizHeader}>
        <div className={styles.vizHeaderRow}>
          <div>
            <CardTitle className={styles.vizTitle}>
              Latest Country Rankings ({updated})
            </CardTitle>
            <div className={styles.vizSub}>
              Unit: <strong>{unitLabel}</strong>
            </div>
          </div>
          <div className={styles.vizActions}>
            <Button variant="outline" size="sm" onClick={() => setAsc((v) => !v)}>
              <ArrowUpDown size={16} />
              {asc ? 'Low → High' : 'High → Low'}
            </Button>
            <Button variant="outline" size="sm" onClick={exportCsv} aria-label="Export CSV">
              <Download size={16} />
            </Button>
            <Button variant="outline" size="sm" onClick={share} aria-label="Share link">
              <Share2 size={16} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className={styles.vizBody}>
        <div className={styles.rankingList}>
          {sorted.map((r) => {
            const selected = selectedCountry === r.country
            const noData = r.value == null

            return (
              <button
                key={r.country}
                type="button"
                className={cn(
                  styles.rankRow,
                  selected && styles.rankRowSelected,
                  noData && styles.rankRowNoData,
                )}
                onClick={() => onSelect(r.country)}
              >
                <div className={styles.rankPill}>
                  {r.value == null ? '—' : `#${r.rank ?? '—'}`}
                </div>

                <div className={styles.rankMain}>
                  <div className={styles.rankTop}>
                    <span className={styles.countryName}>{r.country}</span>
                    {noData ? (
                      <span className={styles.noDataBadge}>
                        <AlertTriangle size={14} /> No data
                      </span>
                    ) : null}
                  </div>

                  {!noData ? (
                    <div className={styles.barTrack}>
                      <div
                        className={styles.barFill}
                        style={{ width: `${((r.value ?? 0) / max) * 100}%` }}
                      />
                    </div>
                  ) : null}
                </div>

                <div className={styles.rankValue}>
                  {noData ? (
                    <span className={styles.valueMuted}>No data</span>
                  ) : (
                    <>
                      <div className={styles.valueNumber}>{fmt(r.value!)}</div>
                      <div className={styles.valueUnit}>{unitLabel}</div>
                    </>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        <MetadataFooter source={source} updated={updated} />
      </CardContent>
    </Card>
  )
}

function SimpleLineChart({ data, unitLabel }: { data: TimeRow[]; unitLabel: string }) {
  const w = 900
  const h = 360
  const padL = 52
  const padR = 20
  const padT = 18
  const padB = 36

  const vals = data.map((d) => d.value).filter((v): v is number => typeof v === 'number')
  const minV = vals.length ? Math.min(...vals) : 0
  const maxV = vals.length ? Math.max(...vals) : 1

  const minY = data[0]?.year ?? 0
  const maxY = data[data.length - 1]?.year ?? 1

  const plotW = w - padL - padR
  const plotH = h - padT - padB

  const x = (year: number) => padL + ((year - minY) / (maxY - minY || 1)) * plotW
  const y = (value: number) => padT + (1 - (value - minV) / (maxV - minV || 1)) * plotH

  const paths: string[] = []
  let current = ''
  data.forEach((d, i) => {
    if (d.value == null) {
      if (current) paths.push(current)
      current = ''
      return
    }
    const px = x(d.year)
    const py = y(d.value)
    if (!current) current = `M ${px} ${py}`
    else current += ` L ${px} ${py}`
    if (i === data.length - 1 && current) paths.push(current)
  })

  return (
    <div className={styles.svgWrap}>
      <svg viewBox={`0 0 ${w} ${h}`} className={styles.svg}>
        <line x1={padL} y1={padT} x2={padL} y2={h - padB} className={styles.axis} />
        <line x1={padL} y1={h - padB} x2={w - padR} y2={h - padB} className={styles.axis} />

        {[0, 0.5, 1].map((t) => {
          const vv = minV + (maxV - minV) * t
          const yy = y(vv)
          return (
            <g key={t}>
              <line x1={padL} y1={yy} x2={w - padR} y2={yy} className={styles.grid} />
              <text x={padL - 10} y={yy + 4} textAnchor="end" className={styles.tick}>
                {fmt(vv)}
              </text>
            </g>
          )
        })}

        {data.map((d, idx) => {
          if (idx % 2 !== 0) return null
          const xx = x(d.year)
          return (
            <text key={d.year} x={xx} y={h - 12} textAnchor="middle" className={styles.tick}>
              {d.year}
            </text>
          )
        })}

        {paths.map((p, i) => (
          <path key={i} d={p} className={styles.line} />
        ))}

        {data.map((d) => {
          if (d.value == null) return null
          return <circle key={d.year} cx={x(d.year)} cy={y(d.value)} r={4} className={styles.dot} />
        })}

        <text x={18} y={h / 2} transform={`rotate(-90 18 ${h / 2})`} className={styles.yLabel}>
          {unitLabel}
        </text>
      </svg>

      <div className={styles.note}>
        <strong>Note:</strong> gaps indicate missing data.
      </div>
    </div>
  )
}

function TimeSeriesCard({
  country,
  unitLabel,
  source,
  updated,
}: {
  country: string
  unitLabel: string
  source: string
  updated: string
}) {
  const exportCsv = () => {
    const csv = [['Year', 'Value', 'Unit'], ...MOCK_TS.map((d) => [d.year, d.value ?? 'No data', unitLabel])]
      .map((r) => r.join(','))
      .join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'timeseries.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const share = async () => {
    await copyToClipboard(window.location.href)
  }

  return (
    <Card className={styles.vizCard}>
      <CardHeader className={styles.vizHeader}>
        <div className={styles.vizHeaderRow}>
          <CardTitle className={styles.vizTitle}>Trend for {country} (2014–2024)</CardTitle>
          <div className={styles.vizActions}>
            <Button variant="outline" size="sm" onClick={exportCsv} aria-label="Export CSV">
              <Download size={16} />
            </Button>
            <Button variant="outline" size="sm" onClick={share} aria-label="Share link">
              <Share2 size={16} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className={styles.vizBody}>
        <SimpleLineChart data={MOCK_TS} unitLabel={unitLabel} />
        <MetadataFooter source={source} updated={updated} />
      </CardContent>
    </Card>
  )
}

function MapCard({
  unitLabel,
  source,
  updated,
}: {
  unitLabel: string
  source: string
  updated: string
}) {
  const [zoom, setZoom] = useState(1)

  const share = async () => {
    await copyToClipboard(window.location.href)
  }

  return (
    <Card className={styles.vizCard}>
      <CardHeader className={styles.vizHeader}>
        <div className={styles.vizHeaderRow}>
          <CardTitle className={styles.vizTitle}>Global Distribution (2024)</CardTitle>
          <div className={styles.vizActions}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom((z) => Math.min(2, z + 0.2))}
              aria-label="Zoom in"
            >
              <ZoomIn size={16} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom((z) => Math.max(0.5, z - 0.2))}
              aria-label="Zoom out"
            >
              <ZoomOut size={16} />
            </Button>
            <Button variant="outline" size="sm" aria-label="Export PNG">
              <Download size={16} />
            </Button>
            <Button variant="outline" size="sm" onClick={share} aria-label="Share link">
              <Share2 size={16} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className={styles.vizBody}>
        <div className={styles.mapBox}>
          <div className={styles.mapPlaceholder} style={{ transform: `scale(${zoom})` }}>
            <div className={styles.mapIcon}>🌍</div>
            <div className={styles.mapTitle}>Interactive Choropleth Map</div>
            <div className={styles.mapText}>
              Here will be an interactive world map with tooltips and click-to-select.
            </div>
          </div>
        </div>

        <div className={styles.legendRow}>
          <span className={styles.legendLabel}>Legend:</span>
          <div className={styles.legendBar} />
          <span className={styles.legendUnit}>{unitLabel}</span>
          <span className={styles.legendNoData}>
            <span className={styles.square} /> No data
          </span>
        </div>

        <div className={styles.mapFeatures}>
          <div className={styles.featuresTitle}>Map Features:</div>
          <ul>
            <li>• Click any country to select and trigger auto-comparison</li>
            <li>• Hover for tooltip with country name, value, rank, and source</li>
            <li>• Gray/hatched areas indicate no data available</li>
            <li>• Color intensity represents value magnitude</li>
          </ul>
        </div>

        <MetadataFooter source={source} updated={updated} />
      </CardContent>
    </Card>
  )
}

function BottomCards() {
  return (
    <div className={styles.bottomGrid}>
      <Card className={styles.bottomCard}>
        <CardHeader>
          <CardTitle className={styles.bottomTitle}>Methodology</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className={styles.bottomDesc}>
            Learn how this indicator is calculated and what data sources are used.
          </CardDescription>
          <Button asChild variant="outline" size="sm">
            <Link to="/docs#methodology">Read More</Link>
          </Button>
        </CardContent>
      </Card>

      <Card className={styles.bottomCard}>
        <CardHeader>
          <CardTitle className={styles.bottomTitle}>Limitations</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className={styles.bottomDesc}>
            Understand the constraints and caveats when interpreting this data.
          </CardDescription>
          <Button asChild variant="outline" size="sm">
            <Link to="/docs#limitations">Read More</Link>
          </Button>
        </CardContent>
      </Card>

      <Card className={styles.bottomCard}>
        <CardHeader>
          <CardTitle className={styles.bottomTitle}>Data Quality</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className={styles.bottomDesc}>
            Review coverage, freshness, and known data quality issues.
          </CardDescription>
          <Button asChild variant="outline" size="sm">
            <Link to="/docs#data-quality">Read More</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export function IndicatorPage() {
  const { code: rawCode } = useParams()
  const code = useMemo(() => (rawCode ? decodeURIComponent(rawCode) : ''), [rawCode])

  const dispatch = useAppDispatch()
  const { items, status, error } = useAppSelector((s) => s.indicators)

  useEffect(() => {
    if (status === 'idle') dispatch(fetchIndicators())
  }, [status, dispatch])

  const indicator = useMemo(() => {
    return (items as Indicator[]).find((i) => i.code === code) ?? null
  }, [items, code])

  const [tab, setTab] = useState<TabKey>('ranking')

  const [rankingRows, setRankingRows] = useState<RankingRow[]>([])
  const [rankingYear, setRankingYear] = useState<string>('—')
  const [rankingStatus, setRankingStatus] = useState<'idle' | 'loading' | 'succeeded' | 'failed'>('idle')
  const [rankingError, setRankingError] = useState<string | null>(null)

  useEffect(() => {
    if (!code) return
    const controller = new AbortController()

    ;(async () => {
      try {
        setRankingStatus('loading')
        setRankingError(null)

        const res = await fetch(
          `http://localhost:4000/api/observations/rankings?indicatorCode=${encodeURIComponent(code)}&limit=200`,
          { signal: controller.signal },
        )

        if (!res.ok) throw new Error(`Rankings request failed: ${res.status}`)

        const data: RankingsApiResponse = await res.json()

        setRankingYear(data.latestYear != null ? String(data.latestYear) : '—')
        setRankingRows(
          data.items.map((it) => ({
            country: it.location?.name ?? '—',
            rank: it.rank,
            value: typeof it.value === 'number' && Number.isFinite(it.value) ? it.value : null,
          })),
        )

        setRankingStatus('succeeded')
      } catch (e: unknown) {
        if (e instanceof DOMException && e.name === 'AbortError') return
      
        setRankingStatus('failed')
        setRankingError(e instanceof Error ? e.message : 'Unknown error')
      }
    })()

    return () => controller.abort()
  }, [code])

  const defaultCountry = useMemo(() => {
    return rankingRows.find((r) => r.value != null)?.country ?? rankingRows[0]?.country ?? null
  }, [rankingRows])

  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)

  const activeCountry = useMemo(() => {
    if (selectedCountry && rankingRows.some((r) => r.country === selectedCountry)) return selectedCountry
    return defaultCountry
  }, [selectedCountry, defaultCountry, rankingRows])

  if (status === 'loading' || status === 'idle') {
    return (
      <div className={styles.page}>
        <div className="container">
          <Card className={styles.headerCard}>
            <div className={styles.topBar} />
            <CardContent className={styles.loadingBox}>Loading…</CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (status === 'failed') {
    return (
      <div className={styles.page}>
        <div className="container">
          <Card className={styles.headerCard}>
            <div className={styles.topBar} />
            <CardHeader>
              <CardTitle>Couldn’t load indicator</CardTitle>
              <CardDescription>{error ?? 'Unknown error'}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => dispatch(fetchIndicators())}>Retry</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!indicator) {
    return (
      <div className={styles.page}>
        <div className="container">
          <Button asChild variant="ghost" className={styles.backBtn}>
            <Link to="/discover">
              <ArrowLeft size={16} /> Back to Data Dictionary
            </Link>
          </Button>

          <Card className={styles.headerCard}>
            <div className={styles.topBar} />
            <CardHeader>
              <CardTitle>Indicator not found</CardTitle>
              <CardDescription>Code: {code}</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    )
  }

  const polarity = getIndicatorPolarity(indicator)
  const higher = polarity === 'HIGHER_IS_BETTER'
  const lower = polarity === 'LOWER_IS_BETTER'

  const unitLabel = formatUnit(indicator)
  const sourceLabel = getRefName(indicator.source) || '—'
  const coverageLabel = formatCoverage(indicator) ?? '—'
  const updatedLabel = getUpdated(indicator)
  const dom = domainLabel(indicator)
  const domainCode = getRefCode(indicator.domain)

  return (
    <div className={styles.page}>
      <div className="container">
        <Button asChild variant="ghost" className={styles.backBtn}>
          <Link to="/discover" className={styles.backLink}>
            <ArrowLeft size={16} />
            Back to Data Dictionary
          </Link>
        </Button>

        <Card className={styles.headerCard}>
          <div className={styles.topBar} />

          <CardHeader className={styles.headerInner}>
            <div className={styles.headerRow}>
              <div className={styles.headerLeft}>
                <div className={styles.titleRow}>
                  <h1 className={styles.h1}>{indicator.name}</h1>
                  {higher ? <TrendingUp className={styles.titleIconUp} size={26} /> : null}
                  {lower ? <TrendingDown className={styles.titleIconDown} size={26} /> : null}
                </div>

                {indicator.description ? <p className={styles.desc}>{indicator.description}</p> : null}
              </div>

              <div className={styles.headerRight}>
                <Badge
                  className={cn(
                    styles.domainBadge,
                    domainCode ? styles.domainKnown : styles.domainOther,
                  )}
                >
                  {dom}
                </Badge>
              </div>
            </div>

            <div className={styles.metaRow}>
              <span
                className={cn(
                  styles.polarityChip,
                  higher && styles.polarityHigher,
                  lower && styles.polarityLower,
                  !higher && !lower && styles.polarityNeutral,
                )}
              >
                {higher ? <TrendingUp size={14} /> : null}
                {lower ? <TrendingDown size={14} /> : null}
                {higher ? 'Higher is better' : lower ? 'Lower is better' : 'Polarity: —'}
              </span>

              <span className={styles.metaChip}>
                <strong>Unit</strong> · {unitLabel}
              </span>
              <span className={styles.metaChip}>
                <strong>Source</strong> · {sourceLabel}
              </span>
              <span className={styles.metaChip}>
                <strong>Coverage</strong> · {coverageLabel}
              </span>
              <span className={styles.metaChip}>
                <strong>Updated</strong> · {updatedLabel}
              </span>
            </div>
          </CardHeader>

          <CardContent className={styles.howToReadBox}>
            <div className={styles.howToRead}>
              <div className={styles.howTitle}>How to Read This Indicator</div>
              <div className={styles.howText}>
                Higher scores indicate better outcomes for this indicator. Gaps in time-series data may reflect
                changes in methodology or data availability.
              </div>
            </div>
          </CardContent>
        </Card>

        <div className={styles.tabs}>
          <button
            type="button"
            className={cn(styles.tabBtn, tab === 'ranking' && styles.tabActive)}
            onClick={() => setTab('ranking')}
          >
            Latest Ranking
          </button>
          <button
            type="button"
            className={cn(styles.tabBtn, tab === 'trends' && styles.tabActive)}
            onClick={() => setTab('trends')}
          >
            Time-Series
          </button>
          <button
            type="button"
            className={cn(styles.tabBtn, tab === 'map' && styles.tabActive)}
            onClick={() => setTab('map')}
          >
            World Map
          </button>
        </div>

        {tab === 'ranking' ? (
          <div className={styles.section}>
            {rankingStatus === 'loading' ? (
              <Card className={styles.vizCard}>
                <CardContent className={styles.loadingBox}>Loading rankings…</CardContent>
              </Card>
            ) : rankingStatus === 'failed' ? (
              <Card className={styles.vizCard}>
                <CardContent className={styles.loadingBox}>
                  Couldn’t load rankings: {rankingError ?? 'Unknown error'}
                </CardContent>
              </Card>
            ) : (
              <RankingCard
                data={rankingRows}
                unitLabel={unitLabel}
                selectedCountry={activeCountry ?? undefined}
                onSelect={(c) => setSelectedCountry(c)}
                source={sourceLabel}
                updated={rankingYear}
              />
            )}
          </div>
        ) : null}

        {tab === 'trends' ? (
          <div className={styles.section}>
            {activeCountry ? (
              <TimeSeriesCard
                country={activeCountry}
                unitLabel={unitLabel}
                source={sourceLabel}
                updated={updatedLabel}
              />
            ) : (
              <Card className={styles.vizCard}>
                <CardContent className={styles.emptyViz}>
                  <AlertTriangle size={44} className={styles.emptyIcon} />
                  <div className={styles.emptyText}>
                    Select a country from the Rankings tab to view time-series data.
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : null}

        {tab === 'map' ? (
          <div className={styles.section}>
            <MapCard unitLabel={unitLabel} source={sourceLabel} updated={updatedLabel} />
          </div>
        ) : null}

        <div className={styles.bottomSection}>
          <BottomCards />
        </div>
      </div>
    </div>
  )
}
