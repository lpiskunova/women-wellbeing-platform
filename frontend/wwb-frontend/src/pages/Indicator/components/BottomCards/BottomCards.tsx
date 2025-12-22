import { Link } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card/Card'
import { Button } from '@/components/ui/button/Button'

import styles from './BottomCards.module.scss'

export function BottomCards() {
  return (
    <div className={styles.bottomGrid}>
      <Card className={styles.bottomCard}>
        <CardHeader>
          <CardTitle className={styles.bottomTitle}>Methodology</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className={styles.bottomDesc}>
            Learn how this indicator is calculated and what data sources are used.
          </CardDescription>
          <Button asChild variant="outline" size="sm">
            <Link to="/docs#methodology">Read More</Link>
          </Button>
        </CardContent>
      </Card>

      <Card className={styles.bottomCard}>
        <CardHeader>
          <CardTitle className={styles.bottomTitle}>Limitations</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className={styles.bottomDesc}>
            Understand the constraints and caveats when interpreting this data.
          </CardDescription>
          <Button asChild variant="outline" size="sm">
            <Link to="/docs#limitations">Read More</Link>
          </Button>
        </CardContent>
      </Card>

      <Card className={styles.bottomCard}>
        <CardHeader>
          <CardTitle className={styles.bottomTitle}>Data Quality</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className={styles.bottomDesc}>
            Review coverage, freshness, and known data quality issues.
          </CardDescription>
          <Button asChild variant="outline" size="sm">
            <Link to="/docs#data-quality">Read More</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
