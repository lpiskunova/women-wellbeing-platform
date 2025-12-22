import { useState } from 'react'
import { Download, Share2, ZoomIn, ZoomOut } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card/Card'
import { Button } from '@/components/ui/button/Button'

import { copyToClipboard } from '@/entities/indicator/indicator.utils'
import { MetadataFooter } from '../MetadataFooter/MetadataFooter'

import styles from './MapCard.module.scss'

type Props = {
  unitLabel: string
  source: string
  updated: string
}

export function MapCard({ unitLabel, source, updated }: Props) {
  const [zoom, setZoom] = useState(1)

  const share = async () => {
    await copyToClipboard(window.location.href)
  }

  return (
    <Card className={styles.vizCard}>
      <CardHeader className={styles.vizHeader}>
        <div className={styles.vizHeaderRow}>
          <CardTitle className={styles.vizTitle}>Global Distribution (2024)</CardTitle>
          <div className={styles.vizActions}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom((z) => Math.min(2, z + 0.2))}
              aria-label="Zoom in"
            >
              <ZoomIn size={16} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom((z) => Math.max(0.5, z - 0.2))}
              aria-label="Zoom out"
            >
              <ZoomOut size={16} />
            </Button>
            <Button variant="outline" size="sm" aria-label="Export PNG">
              <Download size={16} />
            </Button>
            <Button variant="outline" size="sm" onClick={share} aria-label="Share link">
              <Share2 size={16} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className={styles.vizBody}>
        <div className={styles.mapBox}>
          <div className={styles.mapPlaceholder} style={{ transform: `scale(${zoom})` }}>
            <div className={styles.mapIcon}>🌍</div>
            <div className={styles.mapTitle}>Interactive Choropleth Map</div>
            <div className={styles.mapText}>
              Here will be an interactive world map with tooltips and click-to-select.
            </div>
          </div>
        </div>

        <div className={styles.legendRow}>
          <span className={styles.legendLabel}>Legend:</span>
          <div className={styles.legendBar} />
          <span className={styles.legendUnit}>{unitLabel}</span>
          <span className={styles.legendNoData}>
            <span className={styles.square} /> No data
          </span>
        </div>

        <div className={styles.mapFeatures}>
          <div className={styles.featuresTitle}>Map Features:</div>
          <ul>
            <li>Click any country to select and trigger auto-comparison</li>
            <li>Hover for tooltip with country name, value, rank, and source</li>
            <li>Gray/hatched areas indicate no data available</li>
            <li>Color intensity represents value magnitude</li>
          </ul>
        </div>

        <MetadataFooter source={source} updated={updated} />
      </CardContent>
    </Card>
  )
}
