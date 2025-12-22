import { ArrowUpDown, Filter, RotateCcw, Search } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card/Card'
import { Input } from '@/components/ui/input/Input'
import { Select, type SelectOption } from '@/components/ui/select/Select'
import { Button } from '@/components/ui/button/Button'
import type { CountriesSortKey } from '../../entities/countries.interfaces'
import { ALL_REGIONS_LABEL, SORT_OPTIONS } from '../../entities/countries.constants'
import styles from './FiltersBar.module.scss'

type Props = {
  searchQuery: string
  onSearchChange: (value: string) => void
  selectedRegion: string
  onRegionChange: (value: string) => void
  sortBy: CountriesSortKey
  onSortChange: (value: CountriesSortKey) => void
  regionOptions: Array<SelectOption<string>>
  hasActiveFilters: boolean
  onClearAll: () => void
}

export function FiltersBar({
  searchQuery,
  onSearchChange,
  selectedRegion,
  onRegionChange,
  sortBy,
  onSortChange,
  regionOptions,
  hasActiveFilters,
  onClearAll,
}: Props) {
  return (
    <Card className={styles.controlsCard}>
      <CardContent className={styles.controlsContent}>
        <div className={styles.controlsRow}>
          <div className={styles.searchField}>
            <Search className={styles.searchIcon} size={16} />
            <Input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search countries..."
              className={styles.searchInput}
            />
          </div>

          <div className={styles.selectWrap}>
            <Select<string>
              value={selectedRegion}
              options={
                regionOptions.length
                  ? regionOptions
                  : [{ value: ALL_REGIONS_LABEL, label: ALL_REGIONS_LABEL }]
              }
              onValueChange={onRegionChange}
              ariaLabel="Filter by region"
              startIcon={<Filter size={16} />}
              triggerClassName={styles.regionTrigger}
            />
          </div>

          <div className={styles.selectWrap}>
            <Select<CountriesSortKey>
              value={sortBy}
              options={SORT_OPTIONS}
              onValueChange={onSortChange}
              ariaLabel="Sort countries"
              startIcon={<ArrowUpDown size={16} />}
              triggerClassName={styles.sortTrigger}
            />
          </div>

          {hasActiveFilters ? (
            <Button variant="ghost" size="sm" onClick={onClearAll}>
              <RotateCcw size={16} />
              Clear
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}
