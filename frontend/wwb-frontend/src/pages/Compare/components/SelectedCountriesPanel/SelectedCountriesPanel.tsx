import { Download, Plus, Share2, X } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card/Card'
import { Button } from '@/components/ui/button/Button'
import { Select, type SelectOption } from '@/components/ui/select/Select'
import styles from './SelectedCountriesPanel.module.scss'
import { MAX_SELECTED_COUNTRIES } from '../../entities/compare.constants'
import type { Location } from '../../entities/compare.interfaces'

type Props = {
  availableCountries: Location[]
  selectedIso3: string[]
  countriesByIso3: Map<string, Location>
  onAddCountry: (iso3: string) => void
  onRemoveCountry: (iso3: string) => void
  onExport: () => void
  onShare: () => void
}

export function SelectedCountriesPanel({
  availableCountries,
  selectedIso3,
  countriesByIso3,
  onAddCountry,
  onRemoveCountry,
  onExport,
  onShare,
}: Props) {
  const hasSelection = selectedIso3.length > 0
  const canAddMore = selectedIso3.length < MAX_SELECTED_COUNTRIES

  const addableCountries = availableCountries.filter(
    (c) => c.iso3 && !selectedIso3.includes(c.iso3),
  )

  const options: Array<SelectOption<string>> = addableCountries.map((c) => ({
    value: c.iso3!,
    label: `${c.name} (${c.iso3})`,
  }))

  return (
    <Card className={styles.panelCard}>
      <CardHeader className={styles.panelHeader}>
        <div>
          <h2 className={styles.panelTitle}>
            Selected Countries ({selectedIso3.length}/{MAX_SELECTED_COUNTRIES})
          </h2>
          <p className={styles.panelSubtitle}>
            Choose up to {MAX_SELECTED_COUNTRIES} countries to compare below.
          </p>
        </div>

        <div className={styles.actions}>
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            disabled={!hasSelection}
            className={styles.actionBtn}
          >
            <Download size={16} />
            <span>Export CSV</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onShare}
            disabled={!hasSelection}
            className={styles.actionBtn}
          >
            <Share2 size={16} />
            <span>Share Link</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className={styles.panelBody}>
        <div className={styles.badges}>
          {selectedIso3.map((iso3) => (
            <span key={iso3} className={styles.badge}>
              {countriesByIso3.get(iso3)?.name || iso3}
              <button
                type="button"
                className={styles.badgeRemove}
                onClick={() => onRemoveCountry(iso3)}
                aria-label={`Remove ${iso3}`}
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>

        {canAddMore && options.length > 0 && (
          <div className={styles.addRow}>
            <div className={styles.addSelect}>
              <Select<string>
                value=""
                options={options}
                onValueChange={(value) => {
                  if (value) onAddCountry(value)
                }}
                ariaLabel="Add a country"
                placeholder="Add a country…"
                startIcon={<Plus size={14} />}
                triggerClassName={styles.addTrigger}
              />
            </div>

            <div className={styles.addHint}>
              <Plus size={14} /> Select up to {MAX_SELECTED_COUNTRIES} countries
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
