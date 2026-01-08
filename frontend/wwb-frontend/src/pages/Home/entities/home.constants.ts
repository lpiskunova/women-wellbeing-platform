import { BookOpen, Globe, FileText, Users, LineChart, Building2 } from 'lucide-react'
import type {
  AudienceItem,
  DataSourceItem,
  FeatureItem,
  HeroCopy,
  SectionCopy,
  DisclaimerCopy,
} from './home.interfaces'

export const heroCopy: HeroCopy = {
  title: "Women's Well-Being Evaluation Platform",
  description:
    "Turn trusted datasets into clear, comparable insights. Explore women's legal rights, safety, economic participation, education, health, and political representation across countries — with transparency and dignity.",
  primaryCtaLabel: 'Explore Data',
  primaryCtaHref: '/discover',
  secondaryCtaLabel: 'Read Methodology',
  secondaryCtaHref: '/docs#methodology',
  sensitiveMessage:
    "This platform includes statistics on violence and other sensitive topics related to women's well-being. Data is provided for research, policy, and public awareness purposes.",
}

export const featuresSection: SectionCopy = {
  title: 'Platform Features',
  subtitle: "Comprehensive tools and insights to explore women's well-being data worldwide",
}

export const audiencesSection: SectionCopy = {
  title: 'Who This Platform Serves',
  subtitle: 'Designed for diverse audiences with different needs',
}

export const sourcesSection: SectionCopy = {
  title: 'Trusted Data Sources',
  subtitle: 'All data comes from reputable international organizations',
}

export const disclaimerCopy: DisclaimerCopy = {
  title: 'Disclaimer',
  description:
    'Public resource for research, policy analysis, and awareness. Sensitive topics handled respectfully; data from reputable international organizations with transparent methodologies. No personally identifiable information (PII) is collected or displayed.',
}

export const features: FeatureItem[] = [
  {
    icon: BookOpen,
    title: 'Discover Data',
    description:
      'Explore core indicators across rights, safety, economy, education, health, and representation.',
    href: '/discover',
    color: 'purple',
  },
  {
    icon: Globe,
    title: 'Country Profiles',
    description: 'Compare countries on key metrics with coverage/freshness badges.',
    href: '/countries',
    color: 'plum',
  },
  {
    icon: FileText,
    title: 'Research Findings',
    description: 'Curated analyses such as pay gap, femicide, maternal health.',
    href: '/research',
    color: 'pink',
  },
]

export const dataSources: DataSourceItem[] = [
  {
    name: 'World Bank WBL',
    coverage: '~190 countries',
    updated: '2024',
    color: 'purple',
    description: 'Legal rights and economic inclusion index',
  },
  {
    name: 'UN Women Violence',
    coverage: 'Global',
    updated: '2024',
    color: 'violet',
    description: 'Gender equality and women’s empowerment statistics',
  },
  {
    name: 'UN Women Women, Peace and Security, Marriage, Work and Children',
    coverage: 'Global',
    updated: '2024',
    color: 'violet',
    description: 'Gender equality and women’s empowerment statistics',
  },
  {
    name: 'UNODC Femicide',
    coverage: '~195 countries',
    updated: '2023',
    color: 'pink',
    description: 'Violence, crime and justice data',
  },
]

export const audiences: AudienceItem[] = [
  {
    icon: Users,
    title: 'Women & Communities',
    description: 'Quick comparisons and accessible insights on key indicators.',
    color: 'purple',
  },
  {
    icon: LineChart,
    title: 'Researchers & NGOs',
    description: 'Transparent indicators with methodology, downloads, and citations.',
    color: 'plum',
  },
  {
    icon: Building2,
    title: 'Public Agencies',
    description: 'Monitoring dashboards and benchmarks for policy.',
    color: 'violet',
  },
]
