import { Link } from 'react-router-dom'
import { ArrowRight, Database, ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card/Card'
import { Badge } from '@/components/ui/badge/Badge'
import { SensitiveContentBanner } from '@/components/ui/sensitive-content-banner/SensitiveContentBanner'
import { audiences, dataSources, features } from './entities/home.constants'
import styles from './HomePage.module.scss'

const badgeClassByColor: Record<string, string> = {
  purple: styles.badgePurple,
  violet: styles.badgeViolet,
  plum: styles.badgePlum,
  pink: styles.badgePink,
}

export function HomePage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.bannerWrap}>
            <SensitiveContentBanner
              message="This platform includes statistics on violence and other sensitive topics related to women's well-being. Data is provided for research, policy, and public awareness purposes."
              defaultHidden={false}
            />
          </div>

          <div className={styles.heroInner}>
            <h1 className={styles.heroTitle}>Women's Well-Being Evaluation Platform</h1>

            <p className={styles.heroText}>
              Turn trusted datasets into clear, comparable insights. Explore women's legal rights, safety,
              economic participation, education, health, and political representation across countries — with
              transparency and dignity.
            </p>

            <div className={styles.heroActions}>
              <Button asChild size="lg" className={styles.primaryBtn}>
                <Link to="/discover" className={styles.btnLink}>
                  Explore Data <ArrowRight size={20} />
                </Link>
              </Button>

              <Button asChild variant="outline" size="lg" className={styles.secondaryBtn}>
                <Link to="/docs#methodology" className={styles.btnLink}>
                  Read Methodology
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.sectionWhite}>
        <div className="container">
          <h2 className={styles.h2}>Platform Features</h2>
          <p className={styles.sub}>
            Comprehensive tools and insights to explore women's well-being data worldwide
          </p>

          <div className={styles.maxW5xl}>
            <div className={styles.grid3}>
              {features.map((f) => (
                <Card key={f.title} className={styles.featureCard} data-accent={f.color}>
                  <CardHeader className={styles.cardHeader}>
                    <div className={styles.featureIcon} data-accent={f.color}>
                      <f.icon size={28} />
                    </div>

                    <CardTitle className={styles.featureTitle}>{f.title}</CardTitle>
                    <CardDescription className={styles.featureDesc}>{f.description}</CardDescription>
                  </CardHeader>

                  <CardContent className={styles.cardContent}>
                    <Button asChild variant="ghost" className={styles.learnMoreBtn}>
                      <Link to={f.href} className={styles.learnMoreLink} data-accent={f.color}>
                        Learn more <ArrowRight size={16} />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.sectionAlt}>
        <div className="container">
          <div className={styles.maxW4xl}>
            <h2 className={styles.h2}>Who This Platform Serves</h2>
            <p className={styles.sub}>Designed for diverse audiences with different needs</p>

            <div className={styles.grid3}>
              {audiences.map((a) => (
                <Card key={a.title} className={styles.audienceCard}>
                  <CardHeader className={styles.cardHeader}>
                    <div className={styles.audienceIcon} data-accent={a.color}>
                      <a.icon size={28} />
                    </div>
                    <CardTitle className={styles.audienceTitle}>{a.title}</CardTitle>
                  </CardHeader>
                  <CardContent className={styles.cardContent}>
                    <p className={styles.audienceText}>{a.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.sectionWhite}>
        <div className="container">
          <div className={styles.maxW5xl}>
            <h2 className={styles.h2}>Trusted Data Sources</h2>
            <p className={styles.sub}>All data comes from reputable international organizations</p>

            <div className={styles.grid4}>
              {dataSources.map((s) => (
                <Card key={s.name} className={styles.sourceCard}>
                  <CardHeader className={styles.sourceHeader}>
                    <div className={styles.sourceTopRow}>
                      <Badge className={`${styles.badge} ${badgeClassByColor[s.color] ?? styles.badgePurple}`}>
                        {s.updated}
                      </Badge>

                      <span className={styles.dataset}>
                        <Database size={14} /> Dataset
                      </span>
                    </div>

                    <CardTitle className={styles.sourceTitle}>{s.name}</CardTitle>
                    {s.description && (
                      <CardDescription className={styles.sourceDesc}>{s.description}</CardDescription>
                    )}
                  </CardHeader>

                  <CardContent className={styles.sourceContent}>
                    <div className={styles.coverage}>
                      Coverage: <span className={styles.coverageStrong}>{s.coverage}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className={styles.center}>
              <Button asChild variant="outline" className={styles.sourcesBtn}>
                <Link to="/references" className={styles.btnLink}>
                  View All Sources & Licenses
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.sectionAlt}>
        <div className="container">
          <Card className={styles.disclaimer}>
            <CardHeader className={styles.disclaimerHeader}>
              <div className={styles.disclaimerRow}>
                <ShieldAlert size={20} className={styles.disclaimerIcon} />
                <div>
                  <CardTitle className={styles.disclaimerTitle}>Disclaimer</CardTitle>
                  <CardDescription className={styles.disclaimerDesc}>
                    Public resource for research, policy analysis, and awareness. Sensitive topics handled respectfully;
                    data from reputable international organizations with transparent methodologies. No personally identifiable
                    information (PII) is collected or displayed.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      </section>
    </div>
  )
}
