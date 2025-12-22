import { Card, CardContent, CardHeader } from '@/components/ui/card/Card'
import styles from './IndicatorCard.module.scss'
import type {
  IndicatorListItem,
  RankingsResponse,
  Location,
} from '../../entities/compare.interfaces'

type Props = {
  indicator: IndicatorListItem
  rankings: RankingsResponse | undefined
  isLoading: boolean
  selectedIso3: string[]
  countriesByIso3: Map<string, Location>
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

export function IndicatorCard({
  indicator,
  rankings,
  isLoading,
  selectedIso3,
  countriesByIso3,
}: Props) {
  const unit = getUnitLabel(indicator, rankings)

  return (
    <Card className={styles.indicatorCard}>
      <CardHeader className={styles.cardHeader}>
        <div className={styles.cardTitle}>
          {indicator.name} <span className={styles.cardCode}>({indicator.code})</span>
        </div>
      </CardHeader>

      <CardContent className={styles.cardBody}>
        {isLoading ? (
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
                  const item = rankings?.items?.find((x) => x.location.iso3 === iso3)

                  return (
                    <tr key={`${indicator.code}:${iso3}`} className={styles.tr}>
                      <td className={styles.td}>{country?.name || iso3}</td>

                      <td className={styles.td}>
                        <div className={styles.valueCell}>
                          <span className={styles.valueStrong}>
                            {item ? formatValue(item.value) : 'N/A'}
                          </span>
                          {unit && <span className={styles.muted}>{unit}</span>}
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

            {!rankings && <div className={styles.notice}>No data loaded for this indicator.</div>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
