import { Link } from 'react-router-dom'
import { ArrowRight, Database, ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button/Button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card/Card'
import { Badge } from '@/components/ui/badge/Badge'
import { SensitiveContentBanner } from '@/components/ui/sensitive-content-banner/SensitiveContentBanner'
import {
  audiences,
  dataSources,
  features,
  heroCopy,
  featuresSection,
  audiencesSection,
  sourcesSection,
  disclaimerCopy,
} from './entities/home.constants'
import type { Accent, AudienceItem, DataSourceItem, FeatureItem } from './entities/home.interfaces'
import styles from './HomePage.module.scss'
import type { JSX } from 'react'

const badgeClassByColor: Record<Accent, string> = {
  purple: styles.badgePurple,
  plum: styles.badgePlum,
  pink: styles.badgePink,
  violet: styles.badgeViolet,
}

const getBadgeClass = (accent: Accent): string => badgeClassByColor[accent]

export function HomePage(): JSX.Element {
  return (
    <div className={styles.page}>
      <HeroSection />
      <FeaturesSection />
      <AudiencesSection />
      <SourcesSection />
      <DisclaimerSection />
    </div>
  )
}

function HeroSection(): JSX.Element {
  return (
    <section className={styles.hero}>
      <div className="container">
        <div className={styles.bannerWrap}>
          <SensitiveContentBanner message={heroCopy.sensitiveMessage} defaultHidden={false} />
        </div>

        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>{heroCopy.title}</h1>

          <p className={styles.heroText}>{heroCopy.description}</p>

          <div className={styles.heroActions}>
            <Button asChild size="lg" className={styles.primaryBtn}>
              <Link to={heroCopy.primaryCtaHref} className={styles.btnLink}>
                {heroCopy.primaryCtaLabel} <ArrowRight size={20} />
              </Link>
            </Button>

            <Button asChild variant="outline" size="lg" className={styles.secondaryBtn}>
              <Link to={heroCopy.secondaryCtaHref} className={styles.btnLink}>
                {heroCopy.secondaryCtaLabel}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

function FeaturesSection(): JSX.Element {
  return (
    <section className={styles.sectionWhite}>
      <div className="container">
        <h2 className={styles.h2}>{featuresSection.title}</h2>
        <p className={styles.sub}>{featuresSection.subtitle}</p>

        <div className={styles.maxW5xl}>
          <div className={styles.grid3}>
            {features.map((feature) => (
              <FeatureCard key={feature.title} feature={feature} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

interface FeatureCardProps {
  feature: FeatureItem
}

function FeatureCard({ feature }: FeatureCardProps): JSX.Element {
  const Icon = feature.icon

  return (
    <Card className={styles.featureCard} data-accent={feature.color}>
      <CardHeader className={styles.cardHeader}>
        <div className={styles.featureIcon} data-accent={feature.color}>
          <Icon size={28} />
        </div>

        <CardTitle className={styles.featureTitle}>{feature.title}</CardTitle>
        <CardDescription className={styles.featureDesc}>{feature.description}</CardDescription>
      </CardHeader>

      <CardContent className={styles.cardContent}>
        <Button asChild variant="ghost" className={styles.learnMoreBtn}>
          <Link to={feature.href} className={styles.learnMoreLink} data-accent={feature.color}>
            Learn more <ArrowRight size={16} />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

function AudiencesSection(): JSX.Element {
  return (
    <section className={styles.sectionAlt}>
      <div className="container">
        <div className={styles.maxW4xl}>
          <h2 className={styles.h2}>{audiencesSection.title}</h2>
          <p className={styles.sub}>{audiencesSection.subtitle}</p>

          <div className={styles.grid3}>
            {audiences.map((audience) => (
              <AudienceCard key={audience.title} audience={audience} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

interface AudienceCardProps {
  audience: AudienceItem
}

function AudienceCard({ audience }: AudienceCardProps): JSX.Element {
  const Icon = audience.icon

  return (
    <Card className={styles.audienceCard}>
      <CardHeader className={styles.cardHeader}>
        <div className={styles.audienceIcon} data-accent={audience.color}>
          <Icon size={28} />
        </div>
        <CardTitle className={styles.audienceTitle}>{audience.title}</CardTitle>
      </CardHeader>
      <CardContent className={styles.cardContent}>
        <p className={styles.audienceText}>{audience.description}</p>
      </CardContent>
    </Card>
  )
}

function SourcesSection(): JSX.Element {
  return (
    <section className={styles.sectionWhite}>
      <div className="container">
        <div className={styles.maxW5xl}>
          <h2 className={styles.h2}>{sourcesSection.title}</h2>
          <p className={styles.sub}>{sourcesSection.subtitle}</p>

          <div className={styles.grid4}>
            {dataSources.map((source) => (
              <DataSourceCard key={source.name} source={source} />
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
  )
}

interface DataSourceCardProps {
  source: DataSourceItem
}

function DataSourceCard({ source }: DataSourceCardProps): JSX.Element {
  return (
    <Card className={styles.sourceCard}>
      <CardHeader className={styles.sourceHeader}>
        <div className={styles.sourceTopRow}>
          <Badge className={`${styles.badge} ${getBadgeClass(source.color)}`}>
            {source.updated}
          </Badge>

          <span className={styles.dataset}>
            <Database size={14} /> Dataset
          </span>
        </div>

        <CardTitle className={styles.sourceTitle}>{source.name}</CardTitle>
        {source.description && (
          <CardDescription className={styles.sourceDesc}>{source.description}</CardDescription>
        )}
      </CardHeader>

      <CardContent className={styles.sourceContent}>
        <div className={styles.coverage}>
          Coverage: <span className={styles.coverageStrong}>{source.coverage}</span>
        </div>
      </CardContent>
    </Card>
  )
}

function DisclaimerSection(): JSX.Element {
  return (
    <section className={styles.sectionAlt}>
      <div className="container">
        <Card className={styles.disclaimer}>
          <CardHeader className={styles.disclaimerHeader}>
            <div className={styles.disclaimerRow}>
              <ShieldAlert size={20} className={styles.disclaimerIcon} />
              <div>
                <CardTitle className={styles.disclaimerTitle}>{disclaimerCopy.title}</CardTitle>
                <CardDescription className={styles.disclaimerDesc}>
                  {disclaimerCopy.description}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
    </section>
  )
}
