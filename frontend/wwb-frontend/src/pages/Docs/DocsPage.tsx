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

function MethodologyContent() {
  return (
    <>
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Data Sources</h3>
        <p className={styles.bodyText}>
          This platform aggregates data from multiple trusted international organizations:
        </p>

        <ul className={styles.bulletList}>
          {METHODOLOGY_SOURCES.map((s) => (
            <li key={s.name} className={styles.bulletItem}>
              <span className={styles.bulletDot}>•</span>
              <span>
                <strong>{s.name}:</strong> {s.description}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Indicator Calculation</h3>
        <p className={styles.bodyText}>
          Each indicator follows its source organization&apos;s established methodology. Composite
          indices (like WBL Score) aggregate multiple sub-indicators using weighted averages.
          Time-series data preserves original measurement intervals, showing gaps where data is
          unavailable.
        </p>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Data Processing</h3>
        <p className={styles.bodyText}>
          Raw data undergoes quality checks for consistency and completeness. No imputation is
          performed for missing values. All transformations preserve original units and scales.
          Rankings are calculated based on latest available data for each country.
        </p>
      </section>
    </>
  )
}

function LimitationsContent() {
  return (
    <>
      <div className={styles.notice}>
        <div className={styles.noticeTitle}>Critical Notice</div>
        <p className={styles.noticeText}>
          All indicators have inherent limitations. No single metric captures the full complexity of
          women&apos;s well-being. Use multiple indicators together for comprehensive analysis.
        </p>
      </div>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Coverage Gaps</h3>
        <ul className={styles.bulletList}>
          {LIMITATIONS_COVERAGE.map((x) => (
            <li key={x} className={styles.bulletItem}>
              <span className={styles.bulletDot}>•</span>
              <span>{x}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Methodological Constraints</h3>
        <ul className={styles.bulletList}>
          {LIMITATIONS_METHOD.map((x) => (
            <li key={x} className={styles.bulletItem}>
              <span className={styles.bulletDot}>•</span>
              <span>{x}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Temporal Issues</h3>
        <p className={styles.bodyText}>
          Update frequencies vary by source. Some indicators are updated annually, others every 2–3
          years. Time-series comparisons should account for methodology changes over time.
        </p>
      </section>
    </>
  )
}

function HowToReadContent() {
  return (
    <>
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Polarity: Higher vs Lower is Better</h3>

        <div className={styles.polarityGrid}>
          <Card className={styles.polarityCardSuccess}>
            <CardHeader>
              <h4 className={styles.polarityTitle}>
                <span className={styles.polarityArrowSuccess}>↑</span> Higher is Better
              </h4>
            </CardHeader>
            <CardContent>
              <p className={styles.polarityText}>
                Examples: WBL Score, Labor Force Participation, Parliamentary Seats.
              </p>
              <p className={styles.polarityNote}>
                Top-ranked countries have the highest values. Increasing trends indicate
                improvement.
              </p>
            </CardContent>
          </Card>

          <Card className={styles.polarityCardDanger}>
            <CardHeader>
              <h4 className={styles.polarityTitle}>
                <span className={styles.polarityArrowDanger}>↓</span> Lower is Better
              </h4>
            </CardHeader>
            <CardContent>
              <p className={styles.polarityText}>
                Examples: Femicide Rate, Maternal Mortality, Gender Pay Gap.
              </p>
              <p className={styles.polarityNote}>
                Top-ranked countries have the lowest values. Decreasing trends indicate improvement.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Understanding Rankings</h3>
        <p className={styles.bodyText}>
          Rankings are calculated from latest available data. Countries with missing data are
          excluded from rankings. Ties are possible when values are identical.
        </p>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Time-Series Interpretation</h3>
        <p className={styles.bodyText}>
          Gaps in line charts indicate missing data for those years.
        </p>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Map Visualization</h3>
        <p className={styles.bodyText}>
          Color intensity represents value magnitude. Gray/hatched areas indicate no data.
        </p>
      </section>
    </>
  )
}

function GlossaryContent() {
  return (
    <section className={styles.section}>
      <dl className={styles.glossaryList}>
        {GLOSSARY.map((g) => (
          <div key={g.term} className={styles.glossaryItem}>
            <dt className={styles.glossaryTerm}>{g.term}</dt>
            <dd className={styles.glossaryDef}>{g.definition}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
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
    if (active === 'methodology') {
      return {
        icon: <BookOpen size={22} className={styles.panelIcon} />,
        title: 'Data Methodology',
        desc: 'Understanding how indicators are calculated and sourced',
      }
    }
    if (active === 'limitations') {
      return {
        icon: <AlertTriangle size={22} className={styles.panelIcon} />,
        title: 'Data Limitations',
        desc: 'Important constraints and caveats when interpreting data',
      }
    }
    if (active === 'how-to-read') {
      return {
        icon: <Database size={22} className={styles.panelIcon} />,
        title: 'How to Read Indicators',
        desc: 'Guide to interpreting visualizations and understanding polarity',
      }
    }
    return {
      icon: null,
      title: 'Glossary of Terms',
      desc: 'Definitions of key terms and acronyms used throughout the platform',
    }
  }, [active])

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.head}>
          <h1 className={styles.title}>Documentation</h1>
          <p className={styles.subtitle}>
            Comprehensive documentation on data methodology, limitations, and how to interpret
            indicators.
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
            <div className={styles.panelHeader}>
              {header.icon}
              <div>
                <h2 className={styles.panelTitle}>{header.title}</h2>
                <p className={styles.panelDesc}>{header.desc}</p>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {active === 'methodology' && <MethodologyContent />}
            {active === 'limitations' && <LimitationsContent />}
            {active === 'how-to-read' && <HowToReadContent />}
            {active === 'glossary' && <GlossaryContent />}
          </CardContent>
        </Card>

        <Card className={styles.ethics}>
          <CardHeader>
            <div className={styles.panelHeader}>
              <Shield size={22} className={styles.ethicsIcon} />
              <div>
                <div className={styles.ethicsTitle}>Privacy &amp; Data Ethics</div>
                <p className={styles.panelDesc}>{PRIVACY_ETHICS_TEXT}</p>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
