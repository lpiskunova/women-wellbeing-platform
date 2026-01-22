import { useMemo, useState } from 'react'
import { Download, Share2, ZoomIn, ZoomOut } from 'lucide-react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card/Card'
import { Button } from '@/components/ui/button/Button'
import { copyToClipboard, fmt } from '@/entities/indicator/indicator.utils'
import { MetadataFooter } from '../MetadataFooter/MetadataFooter'
import styles from './MapCard.module.scss'

export type MapDatum = {
  iso3: string
  countryName: string
  value: number | null
  rank?: number
}

type Props = {
  unitLabel: string
  source: string
  updated: string
  data?: MapDatum[]
  selectedCountry?: string
  onSelectCountry?: (countryName: string) => void
}

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

type GeoProps = {
  ISO_A3?: string
  iso_a3?: string
  NAME?: string
  name?: string
}

function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[\.\,\(\)]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function getColor(value: number | null | undefined, min: number, max: number): string {
  if (value == null || !Number.isFinite(value) || max <= min) {
    return '#e5e7eb'
  }

  const t = (value - min) / (max - min || 1)

  if (t < 0.2) return '#ede9fe'
  if (t < 0.4) return '#ddd6fe'
  if (t < 0.6) return '#c4b5fd'
  if (t < 0.8) return '#a855f7'
  return '#7c3aed'
}

export function MapCard({
  unitLabel,
  source,
  updated,
  data,
  selectedCountry,
  onSelectCountry,
}: Props) {
  const [zoom, setZoom] = useState(1)
  const [hovered, setHovered] = useState<{ country: string; value: number | null; rank?: number } | null>(
    null,
  )

  const share = async () => {
    await copyToClipboard(window.location.href)
  }

  // data по коду и по названию
  const { dataByIso3, dataByName } = useMemo(() => {
    const byIso3 = new Map<string, MapDatum>()
    const byName = new Map<string, MapDatum>()

    ;(data ?? []).forEach((d) => {
      const iso3 = d.iso3.toUpperCase()
      const normName = normalizeName(d.countryName)
      byIso3.set(iso3, d)
      if (normName) byName.set(normName, d)
    })

    return { dataByIso3: byIso3, dataByName: byName }
  }, [data])

  const numericValues = useMemo(() => {
    const vals: number[] = []
    ;(data ?? []).forEach((d) => {
      if (typeof d.value === 'number' && Number.isFinite(d.value)) vals.push(d.value)
    })
    return vals
  }, [data])

  const minValue = numericValues.length ? Math.min(...numericValues) : 0
  const maxValue = numericValues.length ? Math.max(...numericValues) : 1

  const normalizedSelected = selectedCountry ? normalizeName(selectedCountry) : null

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
            <ComposableMap
              projectionConfig={{ scale: 145 }}
              style={{ width: '100%', height: '100%' }}
            >
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const props = geo.properties as GeoProps

                    const rawName = props.name || props.NAME || ''
                    const countryName = rawName || 'Unknown'
                    const normName = normalizeName(countryName)

                    const iso3 = (props.ISO_A3 || props.iso_a3 || '').toUpperCase()

                    let datum: MapDatum | undefined

                    if (iso3) {
                      datum = dataByIso3.get(iso3)
                    }

                    if (!datum && normName) {
                      datum = dataByName.get(normName)
                    }

                    const hasData = !!datum && datum.value != null
                    const baseFill = hasData
                      ? getColor(datum!.value, minValue, maxValue)
                      : '#e5e7eb'

                    const isSelected =
                      !!normalizedSelected &&
                      (normalizedSelected === normName ||
                        (datum && normalizeName(datum.countryName) === normalizedSelected))

                    const fill = isSelected ? '#4c1d95' : baseFill

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        onMouseEnter={() => {
                          if (!countryName) return
                          setHovered({
                            country: datum?.countryName ?? countryName,
                            value: datum?.value ?? null,
                            rank: datum?.rank,
                          })
                        }}
                        onMouseLeave={() => setHovered(null)}
                        onClick={() => {
                          if (!countryName || !hasData) return
                          onSelectCountry?.(datum?.countryName ?? countryName)
                        }}
                        style={{
                          default: {
                            fill,
                            outline: 'none',
                            stroke: isSelected ? '#4c1d95' : '#cbd5f5',
                            strokeWidth: isSelected ? 1.6 : 0.4,
                          },
                          hover: {
                            fill: hasData
                              ? isSelected
                                ? '#4c1d95'
                                : '#6366f1'
                              : '#e5e7eb',
                            outline: 'none',
                            cursor: hasData ? 'pointer' : 'default',
                            stroke: '#4c1d95',
                            strokeWidth: isSelected ? 1.8 : 1,
                          },
                          pressed: {
                            fill: hasData ? '#4f46e5' : '#e5e7eb',
                            outline: 'none',
                            stroke: '#4c1d95',
                            strokeWidth: 2,
                          },
                        }}
                      />
                    )
                  })
                }
              </Geographies>
            </ComposableMap>
          </div>
        </div>

        <div className={styles.mapText}>
          {hovered ? (
            <>
              <strong>{hovered.country}</strong>{' '}
              {hovered.value == null ? (
                '· No data'
              ) : (
                <>
                  · {fmt(hovered.value)} {unitLabel}
                </>
              )}
              {hovered.rank != null ? <> · Rank #{hovered.rank}</> : null}
            </>
          ) : (
            <>Hover over a country to see value and rank. Click to select it for the Trends tab.</>
          )}
        </div>

        <div className={styles.legendRow}>
          <span className={styles.legendLabel}>Legend:</span>
          <div className={styles.legendBar} />
          <span className={styles.legendUnit}>
            {numericValues.length ? (
              <>
                Low ({fmt(minValue)}) → High ({fmt(maxValue)}) {unitLabel}
              </>
            ) : (
              unitLabel
            )}
          </span>
          <span className={styles.legendNoData}>
            <span className={styles.square} /> No data
          </span>
        </div>

        <div className={styles.mapFeatures}>
          <div className={styles.featuresTitle}>Map Features:</div>
          <ul>
            <li>The country highlighted in the darkest color is the selected country in Latest Ranking tab.</li>
            <li>Click any country to select and trigger auto-comparison</li>
            <li>Hover for tooltip with country name, value, rank, and source</li>
            <li>Gray areas indicate no data available</li>
            <li>Color intensity represents value magnitude</li>
          </ul>
        </div>

        <MetadataFooter source={source} updated={updated} />
      </CardContent>
    </Card>
  )
}
