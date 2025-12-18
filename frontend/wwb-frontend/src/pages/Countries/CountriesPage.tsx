import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpDown, Filter, RotateCcw, Search } from 'lucide-react'
import styles from './CountriesPage.module.scss'
import { Card, CardContent, CardHeader } from '@/components/ui/card/Card'
import { Input } from '@/components/ui/input/Input'
import { Select, type SelectOption } from '@/components/ui/select/Select'
import { Button } from '@/components/ui/button/Button'
import { http } from '@/shared/api/http'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { fetchIndicators } from '@/app/store/indicatorsSlice'
import type { Indicator } from '@/entities/indicator/indicator.interfaces'
import {
  ALL_REGIONS_LABEL,
  FEATURED_INDICATORS_LIMIT,
  METRICS_PER_COUNTRY,
  SORT_OPTIONS,
} from './entities/countries.constants'
import type {
  ApiLocation,
  CountriesSortKey,
  CountryMetric,
  CountryProfile,
  LocationsApiResponse,
  RankingsApiResponse,
} from './entities/countries.interfaces'

function normalize(s: string) {
  return s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim()
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n))
}

function fmtValue(v: number) {
  return v.toLocaleString(undefined, { maximumFractionDigits: 1 })
}

function isAxiosCanceled(e: unknown) {
  return (
    typeof e === 'object' &&
    e !== null &&
    (e as { code?: unknown }).code === 'ERR_CANCELED'
  )
}

function CountryCard({ c }: { c: CountryProfile }) {
  return (
    <Card className={styles.countryCard}>
      <div className={styles.topBar} />

      <CardHeader className={styles.countryHeader}>
        <div className={styles.headRow}>
          <h3 className={styles.countryName}>{c.name}</h3>
          <span className={styles.regionBadge}>{c.region}</span>
        </div>

        <div className={styles.scoresRow}>
          <span className={styles.scoreChip}>
            <span className={styles.scoreDotGreen} />
            Coverage: <strong>{c.coverageScore == null ? '—' : `${c.coverageScore}%`}</strong>
          </span>

          <span className={styles.scoreChip}>
            <span className={styles.scoreDot} />
            Freshness:{' '}
            <strong>{c.freshnessScore == null ? '—' : `${c.freshnessScore}%`}</strong>
          </span>
        </div>
      </CardHeader>

      <div className={styles.metrics}>
        {c.metrics.length ? (
          c.metrics.map((m) => (
            <div key={m.indicatorCode} className={styles.metricRow}>
              <div className={styles.metricLeft}>
                <p className={styles.metricName} title={m.indicatorName}>
                  {m.indicatorName}
                </p>
                <div className={styles.metricMeta}>
                  <span>{m.year}</span>
                  {m.isOutdated ? <span className={styles.outdated}>Outdated</span> : null}
                </div>
              </div>

              <div className={styles.metricRight}>
                <div className={styles.metricValue}>{fmtValue(m.value)}</div>
                <div className={styles.metricRank}>Rank #{m.rank ?? '—'}</div>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.metricRow}>
            <div className={styles.metricLeft}>
              <p className={styles.metricName}>No featured metrics yet</p>
              <div className={styles.metricMeta}>
                <span>—</span>
              </div>
            </div>
            <div className={styles.metricRight}>
              <div className={styles.metricValue}>—</div>
              <div className={styles.metricRank}>Rank #—</div>
            </div>
          </div>
        )}
      </div>

      <div className={styles.linksRow}>
        {c.metrics.map((m) => (
          <Link
            key={`link-${m.indicatorCode}`}
            className={styles.link}
            to={`/indicators/${encodeURIComponent(m.indicatorCode)}`}
          >
            View {m.indicatorName} →
          </Link>
        ))}
        {c.iso3 && (
          <Link
            className={styles.link}
            to={`/compare?countries=${encodeURIComponent(c.iso3)}`}
          >
            Compare →
          </Link>
        )}
      </div>
    </Card>
  )
}

async function fetchAllCountries(signal: AbortSignal): Promise<ApiLocation[]> {
  const limit = 100
  let offset = 0
  let total = 0
  const all: ApiLocation[] = []

  do {
    const res = await http.get<LocationsApiResponse>('/locations', {
      params: { limit, offset },
      signal,
    })
    total = res.data.total
    all.push(...res.data.items)
    offset += limit
  } while (offset < total)

  return all.filter((l) => l.type === 'country' && !!l.iso3)
}

export function CountriesPage() {
  const dispatch = useAppDispatch()
  const {
    items: indicatorItems,
    status: indicatorsStatus,
    error: indicatorsError,
  } = useAppSelector((s) => s.indicators)

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRegion, setSelectedRegion] = useState<string>(ALL_REGIONS_LABEL)
  const [sortBy, setSortBy] = useState<CountriesSortKey>('name')

  const [loadStatus, setLoadStatus] = useState<'idle' | 'loading' | 'succeeded' | 'failed'>(
    'idle',
  )
  const [error, setError] = useState<string | null>(null)

  const [countries, setCountries] = useState<ApiLocation[]>([])
  const [profiles, setProfiles] = useState<CountryProfile[]>([])

  useEffect(() => {
    if (indicatorsStatus === 'idle') dispatch(fetchIndicators())
  }, [dispatch, indicatorsStatus])

  const featuredIndicators = useMemo(() => {
    const all = indicatorItems as Indicator[]
    const sorted = [...all].sort((a, b) => {
      const ay = a.latestYear ?? 0
      const by = b.latestYear ?? 0
      const ac = a.coverageCount ?? 0
      const bc = b.coverageCount ?? 0
      return by - ay || bc - ac || a.name.localeCompare(b.name)
    })
    return sorted.slice(0, FEATURED_INDICATORS_LIMIT)
  }, [indicatorItems])

  useEffect(() => {
    const controller = new AbortController()

    ;(async () => {
      try {
        setLoadStatus('loading')
        setError(null)

        const items = await fetchAllCountries(controller.signal)
        setCountries(items)

        setProfiles(
          items.map((l) => ({
            iso3: l.iso3!,
            name: l.name,
            region: l.region ?? '—',
            coverageScore:
              l.coverage_score == null ? null : Math.round(Number(l.coverage_score)),
            freshnessScore:
              l.freshness_score == null
                ? null
                : clamp(Math.round(Number(l.freshness_score)), 0, 100),
            metrics: [],
          })),
        )

        setLoadStatus('succeeded')
      } catch (e: unknown) {
        if (isAxiosCanceled(e) || (e instanceof DOMException && e.name === 'AbortError')) {
          return
        }
        setLoadStatus('failed')
        setError(e instanceof Error ? e.message : 'Unknown error')
      }
    })()

    return () => controller.abort()
  }, [])

  useEffect(() => {
    if (!countries.length) return
    if (indicatorsStatus !== 'succeeded') return
    if (!featuredIndicators.length) return

    const controller = new AbortController()

    ;(async () => {
      try {
        const metricsByIso3 = new Map<string, CountryMetric[]>()

        await Promise.all(
          featuredIndicators.map(async (ind) => {
            const res = await http.get<RankingsApiResponse>('/observations/rankings', {
              params: { indicatorCode: ind.code, limit: 1000 },
              signal: controller.signal,
            })

            const latestYear = res.data.latestYear

            for (const it of res.data.items) {
              const iso3 = it.location?.iso3
              if (!iso3) continue
              if (typeof it.value !== 'number' || !Number.isFinite(it.value)) continue

              const arr = metricsByIso3.get(iso3) ?? []
              arr.push({
                indicatorCode: ind.code,
                indicatorName: ind.name,
                value: it.value,
                year: it.year,
                rank: it.rank,
                isOutdated: latestYear != null ? it.year < latestYear : false,
              })
              metricsByIso3.set(iso3, arr)
            }
          }),
        )

        setProfiles((prev) =>
          prev.map((p) => {
            const all = metricsByIso3.get(p.iso3) ?? []

            const picked = [...all]
              .sort((a, b) => {
                const ao = a.isOutdated ? 1 : 0
                const bo = b.isOutdated ? 1 : 0
                if (ao !== bo) return ao - bo
                const ar = a.rank ?? 10_000
                const br = b.rank ?? 10_000
                return ar - br || a.indicatorName.localeCompare(b.indicatorName)
              })
              .slice(0, METRICS_PER_COUNTRY)

            return { ...p, metrics: picked }
          }),
        )
      } catch (e: unknown) {
        if (isAxiosCanceled(e) || (e instanceof DOMException && e.name === 'AbortError')) {
          return
        }
        console.error('Failed to load featured metrics', e)
      }
    })()

    return () => controller.abort()
  }, [countries, indicatorsStatus, featuredIndicators])

  const regionOptions = useMemo((): Array<SelectOption<string>> => {
    const set = new Set<string>()
    profiles.forEach((p) => {
      if (p.region && p.region !== '—') set.add(p.region)
    })
    const list = Array.from(set).sort((a, b) => a.localeCompare(b))
    return [
      { value: ALL_REGIONS_LABEL, label: ALL_REGIONS_LABEL },
      ...list.map((r) => ({ value: r, label: r })),
    ]
  }, [profiles])

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedRegion !== ALL_REGIONS_LABEL ||
    sortBy !== 'name'

  const filtered = useMemo(() => {
    const q = normalize(searchQuery)
    let res = profiles

    if (q) res = res.filter((c) => normalize(c.name).includes(q))
    if (selectedRegion !== ALL_REGIONS_LABEL) {
      res = res.filter((c) => c.region === selectedRegion)
    }

    const out = [...res]
    out.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name)
      }
      if (sortBy === 'coverage') {
        return (
          (b.coverageScore ?? -1) - (a.coverageScore ?? -1) ||
          a.name.localeCompare(b.name)
        )
      }
      if (sortBy === 'freshness') {
        return (
          (b.freshnessScore ?? -1) - (a.freshnessScore ?? -1) ||
          a.name.localeCompare(b.name)
        )
      }
      return 0
    })
    return out
  }, [profiles, searchQuery, selectedRegion, sortBy])

  const clearAll = () => {
    setSearchQuery('')
    setSelectedRegion(ALL_REGIONS_LABEL)
    setSortBy('name')
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.hero}>
          <h1 className={styles.h1}>Country Profiles</h1>
          <p className={styles.subtitle}>
            Browse country-level data with key metrics, coverage scores, and quick
            links to detailed indicators.
          </p>
        </div>

        <Card className={styles.controlsCard}>
          <CardContent className={styles.controlsContent}>
            <div className={styles.controlsRow}>
              <div className={styles.searchField}>
                <Search className={styles.searchIcon} size={16} />
                <Input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search countries..."
                  className={styles.searchInput}
                />
              </div>

              <div className={styles.selectWrap}>
                <Select<string>
                  value={selectedRegion}
                  options={
                    regionOptions.length
                      ? regionOptions
                      : [{ value: ALL_REGIONS_LABEL, label: ALL_REGIONS_LABEL }]
                  }
                  onValueChange={setSelectedRegion}
                  ariaLabel="Filter by region"
                  startIcon={<Filter size={16} />}
                  triggerClassName={styles.regionTrigger}
                />
              </div>

              <div className={styles.selectWrap}>
                <Select<CountriesSortKey>
                  value={sortBy}
                  options={SORT_OPTIONS}
                  onValueChange={setSortBy}
                  ariaLabel="Sort countries"
                  startIcon={<ArrowUpDown size={16} />}
                  triggerClassName={styles.sortTrigger}
                />
              </div>

              {hasActiveFilters ? (
                <Button variant="ghost" size="sm" onClick={clearAll}>
                  <RotateCcw size={16} />
                  Clear
                </Button>
              ) : null}
            </div>
          </CardContent>
        </Card>

        <div className={styles.resultsRow}>
          <div
            className={`${styles.resultsPill} ${
              hasActiveFilters ? styles.resultsPillActive : ''
            }`}
          >
            <Search size={14} />
            <span>
              Showing <strong>{filtered.length}</strong> of {profiles.length || '—'} countries
            </span>
          </div>

          {hasActiveFilters ? (
            <button type="button" className={styles.clearAll} onClick={clearAll}>
              Clear all
            </button>
          ) : null}
        </div>

        {indicatorsStatus === 'failed' ? (
          <Card className={styles.emptyCard}>
            <CardContent className={styles.emptyBox}>
              Couldn’t load indicators: {indicatorsError ?? 'Unknown error'}
            </CardContent>
          </Card>
        ) : null}

        {loadStatus === 'failed' ? (
          <Card className={styles.emptyCard}>
            <CardContent className={styles.emptyBox}>
              Couldn’t load countries: {error ?? 'Unknown error'}
            </CardContent>
          </Card>
        ) : null}

        {loadStatus === 'loading' ? (
          <div className={styles.grid}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className={styles.countryCard}>
                <div className={styles.topBar} />
                <CardContent className={styles.emptyBox}>Loading…</CardContent>
              </Card>
            ))}
          </div>
        ) : null}

        {loadStatus === 'succeeded' ? (
          filtered.length ? (
            <div className={styles.grid}>
              {filtered.map((c) => (
                <CountryCard key={c.iso3} c={c} />
              ))}
            </div>
          ) : (
            <Card className={styles.emptyCard}>
              <CardContent className={styles.emptyBox}>
                No countries found matching your filters.
                <div style={{ marginTop: 12 }}>
                  <Button variant="ghost" onClick={clearAll}>
                    Clear filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        ) : null}
      </div>
    </div>
  )
}
