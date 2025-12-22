import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card/Card'
import { Button } from '@/components/ui/button/Button'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { fetchIndicators } from '@/app/store/indicatorsSlice'
import type { Indicator } from '@/entities/indicator/indicator.interfaces'
import {
  ALL_REGIONS_LABEL,
  FEATURED_INDICATORS_LIMIT,
  METRICS_PER_COUNTRY,
  clamp,
  fetchAllCountries,
  isAxiosCanceled,
  normalize,
} from './entities/countries.constants'
import type {
  CountriesSortKey,
  CountryMetric,
  CountryProfile,
  RankingsApiResponse,
} from './entities/countries.interfaces'
import { CountryCard } from './components/CountryCard/CountryCard'
import { FiltersBar } from './components/FiltersBar/FiltersBar'
import { ResultsSummary } from './components/ResultsSummary/ResultsSummary'
import { http } from '@/shared/api/http'
import styles from './CountriesPage.module.scss'
import type { SelectOption } from '@/components/ui/select/Select'
import { useApi } from '@/shared/hooks/useApi'

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

  const {
    data: countries,
    loading: countriesLoading,
    error: countriesError,
  } = useApi(fetchAllCountries)

  const [metricsByIso3, setMetricsByIso3] = useState<Map<string, CountryMetric[]>>(() => new Map())

  useEffect(() => {
    if (indicatorsStatus === 'idle') {
      dispatch(fetchIndicators())
    }
  }, [dispatch, indicatorsStatus])

  const featuredIndicators = useMemo(() => {
    const all = indicatorItems as Indicator[]
    if (!all.length) return []

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
    if (!countries || !countries.length) return
    if (indicatorsStatus !== 'succeeded') return
    if (!featuredIndicators.length) return

    const controller = new AbortController()
    let cancelled = false

    ;(async () => {
      try {
        const next = new Map<string, CountryMetric[]>()

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
              if (typeof it.value !== 'number' || !Number.isFinite(it.value)) {
                continue
              }

              const arr = next.get(iso3) ?? []
              arr.push({
                indicatorCode: ind.code,
                indicatorName: ind.name,
                value: it.value,
                year: it.year,
                rank: it.rank,
                isOutdated: latestYear != null ? it.year < latestYear : false,
              })
              next.set(iso3, arr)
            }
          }),
        )

        if (cancelled) return
        setMetricsByIso3(next)
      } catch (e: unknown) {
        if (cancelled) return
        if (isAxiosCanceled(e) || (e instanceof DOMException && e.name === 'AbortError')) {
          return
        }
        console.error('Failed to load featured metrics', e)
      }
    })()

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [countries, indicatorsStatus, featuredIndicators])

  const profiles: CountryProfile[] = useMemo(() => {
    const list = countries ?? []

    return list.map((l) => {
      const all = metricsByIso3.get(l.iso3!) ?? []

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

      return {
        iso3: l.iso3!,
        name: l.name,
        region: l.region ?? '—',
        coverageScore: l.coverage_score == null ? null : Math.round(Number(l.coverage_score)),
        freshnessScore:
          l.freshness_score == null ? null : clamp(Math.round(Number(l.freshness_score)), 0, 100),
        metrics: picked,
      }
    })
  }, [countries, metricsByIso3])

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
    searchQuery.trim() !== '' || selectedRegion !== ALL_REGIONS_LABEL || sortBy !== 'name'

  const filtered = useMemo(() => {
    const q = normalize(searchQuery)
    let res = profiles

    if (q) res = res.filter((c) => normalize(c.name).includes(q))
    if (selectedRegion !== ALL_REGIONS_LABEL) {
      res = res.filter((c) => c.region === selectedRegion)
    }

    const out = [...res]
    out.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)

      if (sortBy === 'coverage') {
        return (b.coverageScore ?? -1) - (a.coverageScore ?? -1) || a.name.localeCompare(b.name)
      }

      if (sortBy === 'freshness') {
        return (b.freshnessScore ?? -1) - (a.freshnessScore ?? -1) || a.name.localeCompare(b.name)
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
        <header className={styles.hero}>
          <h1 className={styles.h1}>Country Profiles</h1>
          <p className={styles.subtitle}>
            Browse country-level data with key metrics, coverage scores, and quick links to detailed
            indicators.
          </p>
        </header>

        <FiltersBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedRegion={selectedRegion}
          onRegionChange={setSelectedRegion}
          sortBy={sortBy}
          onSortChange={setSortBy}
          regionOptions={regionOptions}
          hasActiveFilters={hasActiveFilters}
          onClearAll={clearAll}
        />

        <ResultsSummary
          totalCountries={profiles.length}
          filteredCountries={filtered.length}
          hasActiveFilters={hasActiveFilters}
          onClearAll={clearAll}
        />

        {indicatorsStatus === 'failed' && (
          <Card className={styles.emptyCard}>
            <CardContent className={styles.emptyBox}>
              Couldn’t load indicators: {indicatorsError ?? 'Unknown error'}
            </CardContent>
          </Card>
        )}

        {countriesError && (
          <Card className={styles.emptyCard}>
            <CardContent className={styles.emptyBox}>
              Couldn’t load countries: {countriesError}
            </CardContent>
          </Card>
        )}

        {countriesLoading && (
          <div className={styles.grid}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className={styles.skeletonCard}>
                <CardContent className={styles.emptyBox}>Loading…</CardContent>
              </Card>
            ))}
          </div>
        )}

        {!countriesLoading && !countriesError && (
          <>
            {filtered.length ? (
              <div className={styles.grid}>
                {filtered.map((c) => (
                  <CountryCard key={c.iso3} profile={c} />
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
            )}
          </>
        )}
      </div>
    </div>
  )
}
