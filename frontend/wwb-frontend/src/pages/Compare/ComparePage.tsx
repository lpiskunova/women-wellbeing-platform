import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import styles from './ComparePage.module.scss'
import { Card, CardContent } from '@/components/ui/card/Card'
import { IndicatorCard } from './components/IndicatorCard/IndicatorCard'
import { SelectedCountriesPanel } from './components/SelectedCountriesPanel/SelectedCountriesPanel'
import {
  API_BASE_URL,
  DEFAULT_ISO3_PRIORITY,
  LIMITS,
  MAX_SELECTED_COUNTRIES,
  QS_COUNTRIES,
  normalizeIso3,
} from './entities/compare.constants'
import type { Location, IndicatorListItem, RankingsResponse } from './entities/compare.interfaces'
import { getLocations } from '@/shared/api/locations'
import { getIndicators } from '@/shared/api/indicators'
import { getIndicatorRankings } from '@/shared/api/observations'
import { useApi } from '@/shared/hooks/useApi'

type CompareMeta = {
  countries: Location[]
  indicators: IndicatorListItem[]
}

function resolveInitialSelection(countries: Location[], params: URLSearchParams): string[] {
  const allowed = new Set(countries.filter((c) => c.iso3).map((c) => c.iso3!))
  if (!allowed.size) return []

  const fromUrl = params.get(QS_COUNTRIES)
  if (fromUrl) {
    const urlCodes = fromUrl
      .split(',')
      .map(normalizeIso3)
      .filter((iso3) => allowed.has(iso3))

    if (urlCodes.length) {
      return urlCodes.slice(0, MAX_SELECTED_COUNTRIES)
    }
  }

  const fallback: string[] = []

  for (const iso3 of DEFAULT_ISO3_PRIORITY) {
    if (allowed.has(iso3)) {
      fallback.push(iso3)
      if (fallback.length >= MAX_SELECTED_COUNTRIES) break
    }
  }

  if (fallback.length < 2) {
    for (const c of countries) {
      if (!c.iso3) continue
      if (fallback.includes(c.iso3)) continue
      fallback.push(c.iso3)
      if (fallback.length >= MAX_SELECTED_COUNTRIES) break
    }
  }

  return fallback.slice(0, MAX_SELECTED_COUNTRIES)
}

function getUnitLabel(ind: IndicatorListItem, rankings?: RankingsResponse) {
  const unit = ind.unit

  if (unit) {
    if (typeof unit === 'string') {
      if (unit.trim()) return unit
    } else {
      if (unit.symbol) return unit.symbol
      if (unit.code) return unit.code
      if (unit.name) return unit.name
    }
  }

  const rUnit = rankings?.indicator?.unit
  if (rUnit) {
    return rUnit.symbol || rUnit.code || rUnit.name || ''
  }

  return ''
}

export default function ComparePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedIso3, setSelectedIso3] = useState<string[]>([])
  const [rankingsByIndicator, setRankingsByIndicator] = useState<
    Record<string, RankingsResponse | undefined>
  >({})
  const [loadingRankings, setLoadingRankings] = useState<Record<string, boolean>>({})
  const [initialSelectionDone, setInitialSelectionDone] = useState(false)

  const loadMeta = useCallback(async (): Promise<CompareMeta> => {
    const [locRes, indRes] = await Promise.all([
      getLocations({ limit: LIMITS.LOCATIONS, offset: 0 }),
      getIndicators({ limit: LIMITS.INDICATORS, offset: 0 }),
    ])

    const countries = (locRes.items ?? [])
      .filter((l) => l.type === 'country' && l.iso3)
      .sort((a, b) => a.name.localeCompare(b.name))

    const indicators = (indRes.items ?? []).sort((a, b) => a.code.localeCompare(b.code))

    return { countries, indicators }
  }, [])

  const { data: meta, loading, error } = useApi<CompareMeta>(loadMeta)

  const countries = meta?.countries ?? []
  const indicators = meta?.indicators ?? []

  const countriesByIso3 = useMemo(() => {
    const list = meta?.countries ?? []
    const map = new Map<string, Location>()
    list.forEach((c) => {
      if (c.iso3) {
        map.set(c.iso3, c)
      }
    })
    return map
  }, [meta])

  const availableCountries = useMemo(() => (meta?.countries ?? []).filter((c) => c.iso3), [meta])

  useEffect(() => {
    if (!meta || initialSelectionDone) return

    setSelectedIso3(resolveInitialSelection(countries, searchParams))
    setInitialSelectionDone(true)
  }, [meta, searchParams, initialSelectionDone, countries])

  useEffect(() => {
    const next = new URLSearchParams(searchParams)

    if (selectedIso3.length) {
      next.set(QS_COUNTRIES, selectedIso3.join(','))
    } else {
      next.delete(QS_COUNTRIES)
    }

    setSearchParams(next, { replace: true })
  }, [selectedIso3, searchParams, setSearchParams])

  useEffect(() => {
    if (!meta?.indicators?.length) return

    let cancelled = false

    const missingCodes = meta.indicators
      .map((ind) => ind.code)
      .filter((code) => !rankingsByIndicator[code])

    if (!missingCodes.length) return
    ;(async () => {
      await Promise.all(
        missingCodes.map(async (code) => {
          if (cancelled) return

          setLoadingRankings((prev) => ({ ...prev, [code]: true }))

          try {
            const data = await getIndicatorRankings(code, LIMITS.RANKINGS)

            if (!cancelled) {
              setRankingsByIndicator((prev) => ({ ...prev, [code]: data }))
            }
          } catch {
            if (!cancelled) {
              setRankingsByIndicator((prev) => ({
                ...prev,
                [code]: undefined,
              }))
            }
          } finally {
            if (!cancelled) {
              setLoadingRankings((prev) => ({ ...prev, [code]: false }))
            }
          }
        }),
      )
    })()

    return () => {
      cancelled = true
    }
  }, [meta, rankingsByIndicator])

  const addCountry = (iso3: string) => {
    const code = normalizeIso3(iso3)
    setSelectedIso3((prev) => {
      if (prev.length >= MAX_SELECTED_COUNTRIES) return prev
      if (prev.includes(code)) return prev
      return [...prev, code]
    })
  }

  const removeCountry = (iso3: string) => {
    setSelectedIso3((prev) => prev.filter((x) => x !== iso3))
  }

  const handleExport = () => {
    if (!selectedIso3.length) return

    const header = [
      'Indicator',
      ...selectedIso3.map((iso3) => countriesByIso3.get(iso3)?.name || iso3),
      'Unit',
    ]

    const rows = indicators.map((ind) => {
      const rankings = rankingsByIndicator[ind.code]
      const unit = getUnitLabel(ind, rankings)

      const row: string[] = [ind.name || ind.code]
      selectedIso3.forEach((iso3) => {
        const item = rankings?.items?.find((x) => x.location.iso3 === iso3)
        row.push(item ? String(item.value) : 'N/A')
      })
      row.push(unit)
      return row
    })

    const csv = [header, ...rows].map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'country-comparison.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleShare = async () => {
    if (!selectedIso3.length) return
    const url = `${window.location.origin}/compare?${QS_COUNTRIES}=${selectedIso3.join(',')}`

    try {
      await navigator.clipboard.writeText(url)
      alert('Comparison link copied to clipboard!')
    } catch {
      alert('Failed to copy link')
    }
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <div className="container">
          <Card className={styles.statusCard}>
            <CardContent className={styles.statusBox}>Loading…</CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.page}>
        <div className="container">
          <Card className={styles.statusCard}>
            <CardContent className={styles.statusBox}>
              <div className={styles.statusTitle}>Error</div>
              <div className={styles.notice}>{error}</div>
              <div className={styles.notice}>
                API: <strong>{API_BASE_URL}</strong>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <header className={styles.header}>
          <h1 className={styles.h1}>Compare Countries</h1>
          <p className={styles.subtitle}>
            Select up to {MAX_SELECTED_COUNTRIES} countries to compare key indicators side-by-side
            with consistent scales and units.
          </p>
        </header>

        <SelectedCountriesPanel
          availableCountries={availableCountries}
          selectedIso3={selectedIso3}
          countriesByIso3={countriesByIso3}
          onAddCountry={addCountry}
          onRemoveCountry={removeCountry}
          onExport={handleExport}
          onShare={handleShare}
        />

        {selectedIso3.length === 0 ? (
          <Card className={styles.emptyCard}>
            <CardContent className={styles.emptyBox}>
              Select at least one country to begin comparison.
            </CardContent>
          </Card>
        ) : (
          <div className={styles.cards}>
            {indicators.map((ind) => {
              const rankings = rankingsByIndicator[ind.code]
              const isLoadingCard = !!loadingRankings[ind.code] && !rankings

              return (
                <IndicatorCard
                  key={ind.code}
                  indicator={ind}
                  rankings={rankings}
                  isLoading={isLoadingCard}
                  selectedIso3={selectedIso3}
                  countriesByIso3={countriesByIso3}
                />
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
