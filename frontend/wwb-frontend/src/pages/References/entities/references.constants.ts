import type { DataSource } from './references.interfaces'

export const DATA_SOURCES: DataSource[] = [
  {
    name: 'Women, Business and the Law (WBL)',
    organization: 'World Bank',
    description:
      "Measures legal frameworks affecting women's economic participation across eight indicators.",
    version: '2024.1',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    lastUpdated: '2024',
    website: 'https://wbl.worldbank.org/',
    coverage: '190 countries',
  },
  {
    name: 'Women, Peace and Security (WPS) Index',
    organization: 'GIWPS',
    description: 'Composite measure of inclusion, justice, and security for women globally.',
    version: '2023',
    license: 'Open Data',
    licenseUrl: 'https://giwps.georgetown.edu/',
    lastUpdated: '2023',
    website: 'https://giwps.georgetown.edu/',
    coverage: '170 countries',
  },
  {
    name: 'Gender Statistics',
    organization: 'UN Women',
    description:
      'Comprehensive gender data covering education, health, economic participation, and representation.',
    version: '2024',
    license: 'UN Open Data',
    licenseUrl: 'https://data.un.org/',
    lastUpdated: '2024',
    website: 'https://data.unwomen.org/',
    coverage: 'Global',
  },
  {
    name: 'Crime and Criminal Justice Statistics',
    organization: 'UNODC',
    description: 'Data on gender-based violence including femicide and intimate partner violence.',
    version: '2023',
    license: 'Open Data',
    licenseUrl: 'https://www.unodc.org/',
    lastUpdated: '2023',
    website: 'https://dataunodc.un.org/',
    coverage: '195 countries',
  },
]
