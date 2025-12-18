import { useMemo, useState } from 'react'
import { ExternalLink, Search } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card/Card'
import { Badge } from '@/components/ui/badge/Badge'
import { Button } from '@/components/ui/button/Button'
import { Input } from '@/components/ui/input/Input'
import { DATA_SOURCES } from './entities/references.constants'
import styles from './ReferencesPage.module.scss'

function normalize(s: string) {
  return s.trim().toLowerCase()
}

export function ReferencesPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredSources = useMemo(() => {
    const q = normalize(searchQuery)
    if (!q) return DATA_SOURCES

    return DATA_SOURCES.filter((source) => {
      const hay = `${source.name} ${source.organization}`.toLowerCase()
      return hay.includes(q)
    })
  }, [searchQuery])

  const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const clearSearch = () => setSearchQuery('')

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.header}>
            <h1 className={styles.title}>Data Sources &amp; Licenses</h1>
            <p className={styles.subtitle}>
              Complete list of datasets, versions, licenses, and update schedules used in this platform.
            </p>
          </div>

          <div className={styles.searchRow}>
            <Search className={styles.searchIcon} />
            <Input
              type="search"
              placeholder="Search data sources..."
              value={searchQuery}
              onChange={onChangeSearch}
              className={styles.searchInput}
            />
          </div>

          {filteredSources.length === 0 ? (
            <div className={styles.empty}>
              <div>No data sources found matching your search.</div>
              <Button variant="ghost" className="mt-4" onClick={clearSearch}>
                Clear search
              </Button>
            </div>
          ) : (
            <div className={styles.list}>
              {filteredSources.map((source) => (
                <Card key={source.name} className={styles.card}>
                  <CardHeader className={styles.cardHeader}>
                    <div className={styles.topRow}>
                      <div>
                        <CardTitle className={styles.cardTitle}>{source.name}</CardTitle>
                        <p className={styles.desc}>{source.description}</p>
                      </div>

                      <Badge className={styles.orgBadge}>{source.organization}</Badge>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className={styles.metaGrid}>
                      <div>
                        <p className={styles.metaLabel}>Version</p>
                        <p className={styles.metaValue}>{source.version}</p>
                      </div>

                      <div>
                        <p className={styles.metaLabel}>Last Updated</p>
                        <p className={styles.metaValue}>{source.lastUpdated}</p>
                      </div>

                      <div>
                        <p className={styles.metaLabel}>Coverage</p>
                        <p className={styles.metaValue}>{source.coverage}</p>
                      </div>

                      <div>
                        <p className={styles.metaLabel}>License</p>
                        <a
                          className={styles.licenseLink}
                          href={source.licenseUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {source.license} <ExternalLink size={14} />
                        </a>
                      </div>
                    </div>

                    <Button asChild variant="outline" size="sm" className={styles.visitBtn}>
                      <a
                        href={source.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.visitLink}
                      >
                        Visit Source Website <ExternalLink size={16} />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
