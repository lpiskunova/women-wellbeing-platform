import { Search } from 'lucide-react'
import styles from './ResultsSummary.module.scss'

type Props = {
  totalCountries: number
  filteredCountries: number
  hasActiveFilters: boolean
  onClearAll: () => void
}

export function ResultsSummary({ totalCountries, filteredCountries, hasActiveFilters }: Props) {
  return (
    <div className={styles.resultsRow}>
      <div className={`${styles.resultsPill} ${hasActiveFilters ? styles.resultsPillActive : ''}`}>
        <Search size={14} />
        <span className={styles.showingChip}>
          Showing <strong>{filteredCountries}</strong> of {totalCountries || '—'} countries
        </span>
      </div>
    </div>
  )
}
