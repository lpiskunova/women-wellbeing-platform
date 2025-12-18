import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import styles from './ComparePage.module.scss'
import {
  API_BASE_URL,
  buildApiUrl,
  DEFAULT_ISO3_PRIORITY,
  ENDPOINTS,
  LIMITS,
  MAX_SELECTED_COUNTRIES,
  parseCountriesParam,
  QS_COUNTRIES,
  normalizeIso3,
} from './entities/compare.constants'
import type {
  IndicatorListItem,
  IndicatorsResponse,
  Location,
  LocationsResponse,
  RankingsResponse,
} from './entities/compare.interfaces'

async function apiGet<T>(pathWithQuery: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(buildApiUrl(pathWithQuery), { signal })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(
      `API ${res.status} ${res.statusText} for ${pathWithQuery}${text ? ` — ${text}` : ''}`,
    )
  }
  return res.json()
}

function formatValue(v: unknown) {
  if (v === null || v === undefined) return 'N/A'
  const n = Number(v)
  if (Number.isNaN(n)) return String(v)
  const hasDecimals = Math.abs(n % 1) > 1e-9
  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: hasDecimals ? 2 : 0,
  }).format(n)
}

function toErrorMessage(e: unknown, fallback = 'Failed to load data') {
  if (e instanceof Error) return e.message || fallback
  if (typeof e === 'string') return e || fallback
  return fallback
}

function resolveInitialSelection(countries: Location[], params: URLSearchParams): string[] {
  const allowed = new Set(
    countries.filter((c) => c.iso3).map((c) => c.iso3!),
  )

  if (!allowed.size) return []

  const fromUrl = parseCountriesParam(params.get(QS_COUNTRIES))
  const initial = fromUrl.filter((iso3) => allowed.has(iso3))
  if (initial.length) return initial.slice(0, MAX_SELECTED_COUNTRIES)

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
  return (
    ind.unit?.symbol ||
    ind.unit?.code ||
    rankings?.indicator?.unit?.code ||
    ''
  )
}

export default function ComparePage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [countries, setCountries] = useState<Location[]>([])
  const [indicators, setIndicators] = useState<IndicatorListItem[]>([])
  const [selectedIso3, setSelectedIso3] = useState<string[]>([])

  const [rankingsByIndicator, setRankingsByIndicator] = useState<
    Record<string, RankingsResponse | undefined>
  >({})
  const [loadingRankings, setLoadingRankings] = useState<Record<string, boolean>>({})

  const countriesByIso3 = useMemo(() => {
    const m = new Map<string, Location>()
    countries.forEach((c) => {
      if (c.iso3) m.set(c.iso3, c)
    })
    return m
  }, [countries])

  useEffect(() => {
    const controller = new AbortController()

    ;(async () => {
      try {
        setLoading(true)
        setError(null)

        const [locRes, indRes] = await Promise.all([
          apiGet<LocationsResponse>(
            `${ENDPOINTS.LOCATIONS}?limit=${LIMITS.LOCATIONS}&offset=0`,
            controller.signal,
          ),
          apiGet<IndicatorsResponse>(
            `${ENDPOINTS.INDICATORS}?limit=${LIMITS.INDICATORS}&offset=0`,
            controller.signal,
          ),
        ])

        const onlyCountries = (locRes.items || [])
          .filter((l) => l.type === 'country' && l.iso3)
          .sort((a, b) => a.name.localeCompare(b.name))

        const sortedIndicators = (indRes.items || []).sort((a, b) =>
          a.code.localeCompare(b.code),
        )

        setCountries(onlyCountries)
        setIndicators(sortedIndicators)
        setSelectedIso3(resolveInitialSelection(onlyCountries, searchParams))
      } catch (e) {
        if (e instanceof DOMException && e.name === 'AbortError') return
        setError(toErrorMessage(e))
      } finally {
        setLoading(false)
      }
    })()

    return () => controller.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const next = new URLSearchParams(searchParams)
    if (selectedIso3.length) next.set(QS_COUNTRIES, selectedIso3.join(','))
    else next.delete(QS_COUNTRIES)
    setSearchParams(next, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIso3])

  useEffect(() => {
    if (!indicators.length) return

    const controller = new AbortController()

    ;(async () => {
      await Promise.allSettled(
        indicators.map(async (ind) => {
          if (rankingsByIndicator[ind.code]) return

          setLoadingRankings((prev) => ({ ...prev, [ind.code]: true }))

          try {
            const data = await apiGet<RankingsResponse>(
              `${ENDPOINTS.RANKINGS}?indicatorCode=${encodeURIComponent(
                ind.code,
              )}&limit=${LIMITS.RANKINGS}`,
              controller.signal,
            )
            setRankingsByIndicator((prev) => ({ ...prev, [ind.code]: data }))
          } catch {
            setRankingsByIndicator((prev) => ({ ...prev, [ind.code]: undefined }))
          } finally {
            setLoadingRankings((prev) => ({ ...prev, [ind.code]: false }))
          }
        }),
      )
    })()

    return () => controller.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indicators])

  const availableCountries = useMemo(
    () => countries.filter((c) => c.iso3),
    [countries],
  )

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
      const rankRes = rankingsByIndicator[ind.code]
      const unit = getUnitLabel(ind, rankRes)

      const row = [ind.name || ind.code]
      selectedIso3.forEach((iso3) => {
        const item = rankRes?.items?.find((x) => x.location.iso3 === iso3)
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
    await navigator.clipboard.writeText(url)
    alert('Comparison link copied to clipboard!')
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>Loading…</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.panel}>
            <div className={styles.panelTitle}>Error</div>
            <div className={styles.notice}>{error}</div>
            <div className={styles.notice}>
              API: <b>{API_BASE_URL}</b>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.title}>Compare Countries</div>
          <div className={styles.subtitle}>
            Select up to {MAX_SELECTED_COUNTRIES} countries to compare indicators.
          </div>
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div className={styles.panelTitle}>
              Selected Countries ({selectedIso3.length}/{MAX_SELECTED_COUNTRIES})
            </div>

            <div className={styles.actions}>
              <button className={styles.btn} onClick={handleExport} disabled={!selectedIso3.length}>
                Export CSV
              </button>
              <button className={styles.btn} onClick={handleShare} disabled={!selectedIso3.length}>
                Share Link
              </button>
            </div>
          </div>

          <div className={styles.badges}>
            {selectedIso3.map((iso3) => (
              <span key={iso3} className={styles.badge}>
                {countriesByIso3.get(iso3)?.name || iso3}
                <button className={styles.badgeX} onClick={() => removeCountry(iso3)}>
                  ✕
                </button>
              </span>
            ))}
          </div>

          {selectedIso3.length < MAX_SELECTED_COUNTRIES && (
            <div className={styles.addRow}>
              <select
                className={styles.select}
                value=""
                onChange={(e) => {
                  if (e.target.value) addCountry(e.target.value)
                }}
              >
                <option value="" disabled>
                  Add a country…
                </option>
                {availableCountries
                  .filter((c) => c.iso3 && !selectedIso3.includes(c.iso3))
                  .map((c) => (
                    <option key={c.iso3!} value={c.iso3!}>
                      {c.name} ({c.iso3})
                    </option>
                  ))}
              </select>
            </div>
          )}
        </div>

        {selectedIso3.length === 0 ? (
          <div className={styles.panel} style={{ marginTop: 14 }}>
            Select at least one country to begin comparison.
          </div>
        ) : (
          <div className={styles.cards}>
            {indicators.map((ind) => {
              const rankRes = rankingsByIndicator[ind.code]
              const isLoadingCard = !!loadingRankings[ind.code] && !rankRes
              const unit = getUnitLabel(ind, rankRes)

              return (
                <div key={ind.code} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardTitle}>
                      {ind.name} <span className={styles.muted}>({ind.code})</span>
                    </div>
                  </div>

                  <div className={styles.cardBody}>
                    {isLoadingCard ? (
                      <div className={styles.notice}>Loading…</div>
                    ) : (
                      <div className={styles.tableWrap}>
                        <table className={styles.table}>
                          <thead>
                            <tr>
                              <th className={styles.th}>Country</th>
                              <th className={styles.th}>Value</th>
                              <th className={styles.th}>Rank</th>
                              <th className={styles.th}>Year</th>
                              <th className={styles.th}>Region</th>
                            </tr>
                          </thead>

                          <tbody>
                            {selectedIso3.map((iso3) => {
                              const country = countriesByIso3.get(iso3)
                              const item = rankRes?.items?.find((x) => x.location.iso3 === iso3)

                              return (
                                <tr key={`${ind.code}:${iso3}`} className={styles.tr}>
                                  <td className={styles.td}>{country?.name || iso3}</td>

                                  <td className={styles.td}>
                                    <div className={styles.valueCell}>
                                      <span className={styles.valueStrong}>
                                        {item ? formatValue(item.value) : 'N/A'}
                                      </span>
                                      {unit ? <span className={styles.muted}>{unit}</span> : null}
                                    </div>
                                  </td>

                                  <td className={styles.td}>{item ? `#${item.rank}` : '—'}</td>
                                  <td className={styles.td}>{item ? item.year : '—'}</td>
                                  <td className={styles.td}>
                                    {item?.location.region || country?.region || '—'}
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>

                        {!rankRes ? (
                          <div className={styles.notice}>No data loaded for this indicator.</div>
                        ) : null}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
