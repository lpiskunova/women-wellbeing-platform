import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AlertTriangle, BookOpen, Database, Shield } from 'lucide-react'

import styles from './DocsPage.module.scss'
import { Card, CardContent, CardHeader } from '@/components/ui/card/Card'

import {
  DOCS_TABS,
  GLOSSARY,
  LIMITATIONS_COVERAGE,
  LIMITATIONS_METHOD,
  METHODOLOGY_SOURCES,
  PRIVACY_ETHICS_TEXT,
} from './entities/docs.constants'
import type { DocsTabId } from './entities/docs.interfaces'

function isTabId(v: string): v is DocsTabId {
  return v === 'methodology' || v === 'limitations' || v === 'how-to-read' || v === 'glossary'
}

export function DocsPage() {
  const location = useLocation()
  const navigate = useNavigate()

  const active = useMemo<DocsTabId>(() => {
    const h = location.hash.replace('#', '')
    return isTabId(h) ? h : 'methodology'
  }, [location.hash])
  
  const setTab = (id: DocsTabId) => {
    navigate({ pathname: location.pathname, hash: id }, { replace: true })
  }  

  const header = useMemo(() => {
    if (active === 'methodology')
      return { icon: <BookOpen size={22} className={styles.panelIcon} />, title: 'Data Methodology', desc: 'Understanding how indicators are calculated and sourced' }
    if (active === 'limitations')
      return { icon: <AlertTriangle size={22} className={styles.panelIcon} />, title: 'Data Limitations', desc: 'Important constraints and caveats when interpreting data' }
    if (active === 'how-to-read')
      return { icon: <Database size={22} className={styles.panelIcon} />, title: 'How to Read Indicators', desc: 'Guide to interpreting visualizations and understanding polarity' }
    return { icon: null, title: 'Glossary of Terms', desc: 'Definitions of key terms and acronyms used throughout the platform' }
  }, [active])

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.head}>
          <h1 className={styles.title}>Documentation</h1>
          <p className={styles.subtitle}>
            Comprehensive documentation on data methodology, limitations, and how to interpret indicators.
          </p>
        </header>

        <div className={styles.tabsRow} role="tablist" aria-label="Documentation sections">
          <div className={styles.tabs}>
            {DOCS_TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={active === t.id}
                className={`${styles.tab} ${active === t.id ? styles.tabActive : ''}`}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <Card className={styles.panel} id={active}>
          <CardHeader>
            {active !== 'glossary' ? (
              <div className={styles.panelHeader}>
                {header.icon}
                <div>
                  <h2 className={styles.panelTitle}>{header.title}</h2>
                  <p className={styles.panelDesc}>{header.desc}</p>
                </div>
              </div>
            ) : (
              <div>
                <h2 className={styles.panelTitle}>{header.title}</h2>
                <p className={styles.panelDesc}>{header.desc}</p>
              </div>
            )}
          </CardHeader>

          <CardContent>
            {active === 'methodology' && (
              <>
                <section className={styles.section}>
                  <h3 className={styles.h3}>Data Sources</h3>
                  <p className={styles.p}>
                    This platform aggregates data from multiple trusted international organizations:
                  </p>

                  <ul className={styles.list}>
                    {METHODOLOGY_SOURCES.map((s) => (
                      <li key={s.name} className={styles.li}>
                        <span className={styles.bullet}>•</span>
                        <span>
                          <strong>{s.name}:</strong> {s.description}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className={styles.section}>
                  <h3 className={styles.h3}>Indicator Calculation</h3>
                  <p className={styles.p}>
                    Each indicator follows its source organization's established methodology. Composite indices (like WBL Score)
                    aggregate multiple sub-indicators using weighted averages. Time-series data preserves original measurement intervals,
                    showing gaps where data is unavailable.
                  </p>
                </section>

                <section className={styles.section}>
                  <h3 className={styles.h3}>Data Processing</h3>
                  <p className={styles.p}>
                    Raw data undergoes quality checks for consistency and completeness. No imputation is performed for missing values.
                    All transformations preserve original units and scales. Rankings are calculated based on latest available data for each country.
                  </p>
                </section>
              </>
            )}

            {active === 'limitations' && (
              <>
                <div className={styles.alert}>
                  <div className={styles.alertTitle}>Critical Notice</div>
                  <p className={styles.alertText}>
                    All indicators have inherent limitations. No single metric captures the full complexity of women's well-being.
                    Use multiple indicators together for comprehensive analysis.
                  </p>
                </div>

                <section className={styles.section}>
                  <h3 className={styles.h3}>Coverage Gaps</h3>
                  <ul className={styles.list}>
                    {LIMITATIONS_COVERAGE.map((x) => (
                      <li key={x} className={styles.li}>
                        <span className={styles.bullet}>•</span>
                        <span>{x}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className={styles.section}>
                  <h3 className={styles.h3}>Methodological Constraints</h3>
                  <ul className={styles.list}>
                    {LIMITATIONS_METHOD.map((x) => (
                      <li key={x} className={styles.li}>
                        <span className={styles.bullet}>•</span>
                        <span>{x}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className={styles.section}>
                  <h3 className={styles.h3}>Temporal Issues</h3>
                  <p className={styles.p}>
                    Update frequencies vary by source. Some indicators are updated annually, others every 2–3 years.
                    Time-series comparisons should account for methodology changes over time.
                  </p>
                </section>
              </>
            )}

            {active === 'how-to-read' && (
              <>
                <section className={styles.section}>
                  <h3 className={styles.h3}>Polarity: Higher vs Lower is Better</h3>

                  <div className={styles.grid2}>
                    <Card className={styles.miniCardGreen}>
                      <CardHeader>
                        <h4 className={styles.miniTitle}>
                          <span style={{ color: 'rgba(16, 185, 129, 1)', fontWeight: 900 }}>↑</span> Higher is Better
                        </h4>
                      </CardHeader>
                      <CardContent>
                        <p className={styles.miniP}>
                          Examples: WBL Score, Labor Force Participation, Parliamentary Seats
                        </p>
                        <p className={styles.miniSmall}>
                          Top-ranked countries have the highest values. Increasing trends indicate improvement.
                        </p>
                      </CardContent>
                    </Card>

                    <Card className={styles.miniCardRed}>
                      <CardHeader>
                        <h4 className={styles.miniTitle}>
                          <span style={{ color: 'rgba(244, 63, 94, 1)', fontWeight: 900 }}>↓</span> Lower is Better
                        </h4>
                      </CardHeader>
                      <CardContent>
                        <p className={styles.miniP}>
                          Examples: Femicide Rate, Maternal Mortality, Gender Pay Gap
                        </p>
                        <p className={styles.miniSmall}>
                          Top-ranked countries have the lowest values. Decreasing trends indicate improvement.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </section>

                <section className={styles.section}>
                  <h3 className={styles.h3}>Understanding Rankings</h3>
                  <p className={styles.p}>
                    Rankings are calculated from latest available data. Countries with missing data are excluded from rankings.
                    Ties are possible when values are identical.
                  </p>
                </section>

                <section className={styles.section}>
                  <h3 className={styles.h3}>Time-Series Interpretation</h3>
                  <p className={styles.p}>
                    Gaps in line charts indicate missing data for those years. Do not interpolate between points.
                    Methodology changes may cause discontinuities marked in the data.
                  </p>
                </section>

                <section className={styles.section}>
                  <h3 className={styles.h3}>Map Visualization</h3>
                  <p className={styles.p}>
                    Color intensity represents value magnitude. Gray/hatched areas indicate no data.
                    Tooltips show exact values, ranks, and sources. Selecting a country triggers auto-comparison with similar values
                    or regional neighbors.
                  </p>
                </section>
              </>
            )}

            {active === 'glossary' && (
              <section className={styles.section}>
                <dl style={{ display: 'flex', flexDirection: 'column', gap: 14, margin: 0 }}>
                  {GLOSSARY.map((g) => (
                    <div key={g.term}>
                      <dt style={{ fontWeight: 900, marginBottom: 6, color: 'var(--foreground)' }}>{g.term}</dt>
                      <dd style={{ margin: 0, color: 'var(--muted-foreground)', lineHeight: 1.65, fontSize: 14 }}>
                        {g.definition}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}
          </CardContent>
        </Card>

        <Card className={styles.ethics}>
          <CardHeader>
            <div className={styles.panelHeader}>
              <Shield size={22} className={styles.ethicsIcon} />
              <div>
                <div style={{ margin: 0, fontWeight: 900, color: 'var(--foreground)' }}>
                  Privacy &amp; Data Ethics
                </div>
                <p className={styles.panelDesc}>{PRIVACY_ETHICS_TEXT}</p>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
