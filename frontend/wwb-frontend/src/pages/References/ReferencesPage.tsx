import { useMemo, useState } from 'react'
import { ExternalLink, Search } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card/Card'
import { Badge } from '@/components/ui/badge/Badge'
import { Button } from '@/components/ui/button/Button'
import { Input } from '@/components/ui/input/Input'
import { DATA_SOURCES } from './entities/references.constants'
import type { DataSource } from './entities/references.interfaces'
import styles from './ReferencesPage.module.scss'

const normalize = (value: string) => value.trim().toLowerCase()

type DataSourceCardProps = {
  source: DataSource
}

function DataSourceCard({ source }: DataSourceCardProps) {
  return (
    <Card className={styles.card}>
      <CardHeader className={styles.cardHeader}>
        <div className={styles.cardHeaderTop}>
          <div className={styles.cardHeaderMain}>
            <CardTitle className={styles.cardTitle}>{source.name}</CardTitle>
            <p className={styles.cardDescription}>{source.description}</p>
          </div>

          <Badge className={styles.orgBadge}>{source.organization}</Badge>
        </div>
      </CardHeader>

      <CardContent className={styles.cardContent}>
        <dl className={styles.metaGrid}>
          <div className={styles.metaItem}>
            <dt className={styles.metaLabel}>Version</dt>
            <dd className={styles.metaValue}>{source.version}</dd>
          </div>

          <div className={styles.metaItem}>
            <dt className={styles.metaLabel}>Last Updated</dt>
            <dd className={styles.metaValue}>{source.lastUpdated}</dd>
          </div>

          <div className={styles.metaItem}>
            <dt className={styles.metaLabel}>Coverage</dt>
            <dd className={styles.metaValue}>{source.coverage}</dd>
          </div>

          <div className={styles.metaItem}>
            <dt className={styles.metaLabel}>License</dt>
            <dd className={styles.metaValue}>
              <a
                href={source.licenseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.licenseLink}
              >
                {source.license}
                <ExternalLink size={14} />
              </a>
            </dd>
          </div>
        </dl>

        <Button asChild variant="outline" size="sm" className={styles.visitBtn}>
          <a
            href={source.website}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.visitLink}
          >
            Visit Source Website
            <ExternalLink size={16} />
          </a>
        </Button>
      </CardContent>
    </Card>
  )
}

export function ReferencesPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredSources = useMemo(() => {
    const q = normalize(searchQuery)
    if (!q) return DATA_SOURCES

    return DATA_SOURCES.filter((source) => {
      const haystack = `${source.name} ${source.organization}`.toLowerCase()
      return haystack.includes(q)
    })
  }, [searchQuery])

  const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  const handleClearSearch = () => setSearchQuery('')

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.inner}>
          <header className={styles.header}>
            <h1 className={styles.title}>Data Sources &amp; Licenses</h1>
            <p className={styles.subtitle}>
              Complete list of datasets, versions, licenses, and update schedules used in this
              platform.
            </p>
          </header>

          <div className={styles.searchRow}>
            <Search className={styles.searchIcon} aria-hidden="true" />
            <Input
              type="search"
              placeholder="Search data sources..."
              value={searchQuery}
              onChange={handleChangeSearch}
              className={styles.searchInput}
              aria-label="Search data sources"
            />
          </div>

          {filteredSources.length === 0 ? (
            <div className={styles.empty}>
              <p className={styles.emptyText}>No data sources found matching your search.</p>
              <Button variant="ghost" onClick={handleClearSearch}>
                Clear search
              </Button>
            </div>
          ) : (
            <div className={styles.list}>
              {filteredSources.map((source) => (
                <DataSourceCard key={source.name} source={source} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
