import { useMemo, useState } from 'react'
import { ArrowUpDown, Download, Share2, AlertTriangle } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card/Card'
import { Button } from '@/components/ui/button/Button'
import { fmt, copyToClipboard } from '@/entities/indicator/indicator.utils'
import { MetadataFooter } from '../MetadataFooter/MetadataFooter'
import styles from './RankingCard.module.scss'

export type RankingRow = {
  country: string
  value: number | null
  rank?: number
}

type Props = {
  data: RankingRow[]
  unitLabel: string
  selectedCountry?: string
  onSelect: (country: string) => void
  source: string
  updated: string
}

export function RankingCard({
  data,
  unitLabel,
  selectedCountry,
  onSelect,
  source,
  updated,
}: Props) {
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
            <CardTitle className={styles.vizTitle}>Latest Country Rankings ({updated})</CardTitle>
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
                <div className={styles.rankPill}>{r.value == null ? '—' : `#${r.rank ?? '—'}`}</div>

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
