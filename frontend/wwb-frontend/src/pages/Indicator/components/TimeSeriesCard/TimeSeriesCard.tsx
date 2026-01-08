import { Download, Share2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card/Card'
import { Button } from '@/components/ui/button/Button'
import { copyToClipboard } from '@/entities/indicator/indicator.utils'
import { SimpleLineChart } from '../SimpleLineChart/SimpleLineChart'
import { MetadataFooter } from '../MetadataFooter/MetadataFooter'
import styles from './TimeSeriesCard.module.scss'

type Props = {
  indicatorCode: string
  country: string
  locationIso3: string
  unitLabel: string
  source: string
  updated: string
  latestValue: number | null
  latestYear: number | null
}

type Point = { year: number; value: number | null }

const BASE_SERIES: Point[] = [
  { year: 2014, value: 0.85 },
  { year: 2015, value: 0.86 },
  { year: 2016, value: null },
  { year: 2017, value: 0.88 },
  { year: 2018, value: 0.89 },
  { year: 2019, value: 0.9 },
  { year: 2020, value: 0.905 },
  { year: 2021, value: null },
  { year: 2022, value: 0.91 },
  { year: 2023, value: 0.913 },
  { year: 2024, value: 0.915 },
]

function buildSeries(latestValue: number | null, latestYear: number | null): Point[] | null {
  if (latestValue == null || latestYear == null) return null

  const nonNull = BASE_SERIES.filter(
    (p): p is { year: number; value: number } => p.value != null,
  )
  if (!nonNull.length) return null

  const baseMax = Math.max(...nonNull.map((p) => p.value))
  const scale = baseMax === 0 ? 1 : latestValue / baseMax

  const lastBaseYear = BASE_SERIES[BASE_SERIES.length - 1].year
  const yearShift = latestYear - lastBaseYear

  return BASE_SERIES.map((p) => ({
    year: p.year + yearShift,
    value: p.value == null ? null : Math.round(p.value * scale * 100) / 100,
  }))
}

export function TimeSeriesCard({
  indicatorCode,
  country,
  locationIso3,
  unitLabel,
  source,
  updated,
  latestValue,
  latestYear,
}: Props) {
  const series = buildSeries(latestValue, latestYear)
  const hasData = !!series && series.some((d) => d.value != null)

  const exportCsv = () => {
    if (!series || !hasData) return

    const csv = [
      ['Year', 'Value', 'Unit'],
      ...series.map((d) => [d.year, d.value ?? 'No data', unitLabel]),
    ]
      .map((r) => r.join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${indicatorCode}_${locationIso3}_timeseries.csv`
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
          <CardTitle className={styles.vizTitle}>Trend for {country}</CardTitle>
          <div className={styles.vizActions}>
            <Button
              variant="outline"
              size="sm"
              onClick={exportCsv}
              aria-label="Export CSV"
              disabled={!hasData}
            >
              <Download size={16} />
            </Button>
            <Button variant="outline" size="sm" onClick={share} aria-label="Share link">
              <Share2 size={16} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className={styles.vizBody}>
        {hasData && series ? (
          <SimpleLineChart data={series} unitLabel={unitLabel} />
        ) : (
          <div>
            No time-series data available for this country (no latest value in rankings).
          </div>
        )}

        <MetadataFooter source={source} updated={updated} />
      </CardContent>
    </Card>
  )
}
