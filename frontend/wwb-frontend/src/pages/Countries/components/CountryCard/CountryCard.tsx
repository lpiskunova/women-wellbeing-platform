import { Link } from 'react-router-dom'
import { Card, CardHeader } from '@/components/ui/card/Card'
import type { CountryProfile } from '../../entities/countries.interfaces'
import { fmtValue } from '../../entities/countries.constants'
import styles from './CountryCard.module.scss'

type Props = {
  profile: CountryProfile
}

export function CountryCard({ profile }: Props) {
  const c = profile

  return (
    <Card className={styles.card}>
      <div className={styles.topBar} />

      <CardHeader className={styles.header}>
        <div className={styles.headRow}>
          <h3 className={styles.name}>{c.name}</h3>
          <span className={styles.regionBadge}>{c.region}</span>
        </div>

        <div className={styles.scoresRow}>
          <span className={styles.scoreChip}>
            <span className={styles.scoreDotGreen} />
            Coverage: <strong>{c.coverageScore == null ? '—' : `${c.coverageScore}%`}</strong>
          </span>

          <span className={styles.scoreChip}>
            <span className={styles.scoreDot} />
            Freshness: <strong>{c.freshnessScore == null ? '—' : `${c.freshnessScore}%`}</strong>
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
                  {m.isOutdated ? (
                    <span className={styles.outdated}>Outdated ({m.year})</span>
                  ) : null}
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
          <Link className={styles.link} to={`/compare?countries=${encodeURIComponent(c.iso3)}`}>
            Compare →
          </Link>
        )}
      </div>
    </Card>
  )
}
