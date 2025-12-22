import { useEffect, useMemo, useState, useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { fetchIndicators } from '@/app/store/indicatorsSlice'
import type { Indicator } from '@/entities/indicator/indicator.interfaces'
import { AppErrorBoundary } from '@/app/providers/AppErrorBoundary'
import {
  formatCoverage,
  formatUnit,
  getIndicatorPolarity,
  getRefCode,
  getRefName,
} from '@/entities/indicator/indicator.utils'
import { getIndicatorRankings } from '@/shared/api/observations'
import { useApi } from '@/shared/hooks/useApi'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card/Card'
import { Button } from '@/components/ui/button/Button'
import { Badge } from '@/components/ui/badge/Badge'
import { RankingCard, type RankingRow } from './components/RankingCard/RankingCard'
import { TimeSeriesCard } from './components/TimeSeriesCard/TimeSeriesCard'
import { MapCard } from './components/MapCard/MapCard'
import { BottomCards } from './components/BottomCards/BottomCards'
import styles from './IndicatorPage.module.scss'

type TabKey = 'ranking' | 'trends' | 'map'

function domainLabel(ind: Indicator) {
  return getRefName(ind.domain) || '—'
}

function getUpdated(ind: Indicator) {
  if (typeof ind.latestYear === 'number') return String(ind.latestYear)
  if (typeof ind.updateYear === 'number') return String(ind.updateYear)

  if (ind.lastUpdated) {
    const date = new Date(ind.lastUpdated)
    if (!Number.isNaN(date.getTime())) return String(date.getFullYear())
  }

  return '—'
}

export function IndicatorPageInner() {
  const { code: rawCode } = useParams()
  const code = useMemo(() => (rawCode ? decodeURIComponent(rawCode) : ''), [rawCode])

  const dispatch = useAppDispatch()
  const { items, status, error } = useAppSelector((s) => s.indicators)

  useEffect(() => {
    if (status === 'idle') {
      void dispatch(fetchIndicators())
    }
  }, [status, dispatch])

  const indicator = useMemo(
    () => (items as Indicator[]).find((i) => i.code === code) ?? null,
    [items, code],
  )

  const [tab, setTab] = useState<TabKey>('ranking')
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)

  const loadRankings = useCallback(
    () => getIndicatorRankings(code, 200),
    [code]
  )

  const {
    data: rankingsData,
    loading: rankingsLoading,
    error: rankingsError,
    refetch: refetchRankings,
  } = useApi(loadRankings)

  const rankingRows = useMemo<RankingRow[]>(() => {
    if (!rankingsData) return []
    return rankingsData.items.map((it) => ({
      country: it.location?.name ?? '—',
      rank: it.rank,
      value: typeof it.value === 'number' && Number.isFinite(it.value) ? it.value : null,
    }))
  }, [rankingsData])

  const rankingYear = useMemo(
    () => (rankingsData && rankingsData.latestYear != null ? String(rankingsData.latestYear) : '—'),
    [rankingsData],
  )

  const defaultCountry = useMemo(() => {
    return rankingRows.find((r) => r.value != null)?.country ?? rankingRows[0]?.country ?? null
  }, [rankingRows])

  const activeCountry = useMemo(() => {
    if (selectedCountry && rankingRows.some((r) => r.country === selectedCountry)) {
      return selectedCountry
    }
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

                {indicator.description ? (
                  <p className={styles.desc}>{indicator.description}</p>
                ) : null}
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
                Higher scores indicate better outcomes for this indicator. Gaps in time-series data
                may reflect changes in methodology or data availability.
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
            {rankingsLoading && !rankingsData ? (
              <Card className={styles.vizCard}>
                <CardContent className={styles.loadingBox}>Loading rankings…</CardContent>
              </Card>
            ) : rankingsError ? (
              <Card className={styles.vizCard}>
                <CardContent className={styles.loadingBox}>
                  Couldn’t load rankings: {rankingsError}
                  <div style={{ marginTop: 8 }}>
                    <Button variant="ghost" size="sm" onClick={() => void refetchRankings()}>
                      Retry
                    </Button>
                  </div>
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

export function IndicatorPage() {
  return (
    <AppErrorBoundary>
      <IndicatorPageInner />
    </AppErrorBoundary>
  )
}
