import { Download, Share2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card/Card'
import { Button } from '@/components/ui/button/Button'
import { copyToClipboard } from '@/entities/indicator/indicator.utils'
import { SimpleLineChart } from '../SimpleLineChart/SimpleLineChart'
import { MetadataFooter } from '../MetadataFooter/MetadataFooter'
import styles from './TimeSeriesCard.module.scss'

const MOCK_TS = [
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

type Props = {
  country: string
  unitLabel: string
  source: string
  updated: string
}

export function TimeSeriesCard({ country, unitLabel, source, updated }: Props) {
  const exportCsv = () => {
    const csv = [
      ['Year', 'Value', 'Unit'],
      ...MOCK_TS.map((d) => [d.year, d.value ?? 'No data', unitLabel]),
    ]
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
