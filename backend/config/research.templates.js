const TEMPLATES = [
  {
    id: 'low-pay-gap',
    title: 'Countries with Lowest Gender Pay Gap',
    description:
      'Countries where the gender pay gap is below 10% and female labor force participation exceeds 70%.',
    type: 'template',
    topic: 'Economic Participation',
    years: '2023-2024',
    criteria: ['Pay Gap < 10%', 'Female LFP ≥ 70%'],
    lastUpdated: '2024',
    sources: ['ILO', 'World Bank'],
    results: [
      {
        country: 'Iceland',
        region: 'Europe',
        year: '2024',
        values: {
          'Pay Gap': '3.2%',
          'Female LFP': '82.5%',
        },
        meetsAllCriteria: true,
      },
      {
        country: 'Sweden',
        region: 'Europe',
        year: '2024',
        values: {
          'Pay Gap': '4.5%',
          'Female LFP': '80.5%',
        },
        meetsAllCriteria: true,
      },
      {
        country: 'Norway',
        region: 'Europe',
        year: '2024',
        values: {
          'Pay Gap': '5.1%',
          'Female LFP': '78.9%',
        },
        meetsAllCriteria: true,
      },
    ],
  },
  {
    id: 'health-representation',
    title: 'Low Maternal Mortality with High Political Representation',
    description:
      'Countries with maternal mortality below 10 per 100k and women holding over 40% of parliamentary seats.',
    type: 'template',
    topic: 'Health',
    years: '2023',
    criteria: ['Maternal Mortality < 10 per 100k', 'Parliamentary Seats ≥ 40%'],
    lastUpdated: '2023',
    sources: ['WHO', 'IPU'],
    results: [
      {
        country: 'Rwanda',
        region: 'Africa',
        year: '2023',
        values: {
          'Maternal Mortality (per 100k)': '8',
          'Parliamentary Seats': '61.3%',
        },
        meetsAllCriteria: true,
      },
      {
        country: 'Sweden',
        region: 'Europe',
        year: '2023',
        values: {
          'Maternal Mortality (per 100k)': '4',
          'Parliamentary Seats': '46.1%',
        },
        meetsAllCriteria: true,
      },
      {
        country: 'New Zealand',
        region: 'Oceania',
        year: '2023',
        values: {
          'Maternal Mortality (per 100k)': '9',
          'Parliamentary Seats': '48.3%',
        },
        meetsAllCriteria: true,
      },
    ],
  },
  {
    id: 'femicide-policy-brief',
    title: 'Femicide & Policy Response Snapshot',
    description:
      'Where low femicide rates coincide with active policy measures against violence — and where gaps remain.',
    type: 'brief',
    topic: 'Safety & Violence',
    years: '2018–2023',
    criteria: [
      'Femicide rate < 1 per 100k (latest UNODC)',
      '≥ 3 UN Women VAW measures recorded since 2018',
    ],
    lastUpdated: '2023',
    sources: ['UNODC', 'UN Women – Data Map on Violence'],
    keyFindings: [
      'Across countries with available data, only about a dozen meet both conditions: low femicide rates and multiple recent measures documented in UN Women’s Data Map.',
      'Roughly half of countries with low femicide rates show no new measures in the last five years — positive outcomes, but weak evidence of ongoing policy work.',
      'A smaller group combines high femicide rates with only one or two measures, pointing to gaps in implementation and enforcement rather than a complete absence of policy.',
    ],
    leaderCountries: [
      { name: 'Spain', femicideRate: '0.4', measuresCount: 6 },
      { name: 'Canada', femicideRate: '0.5', measuresCount: 5 },
      { name: 'Rwanda', femicideRate: '0.6', measuresCount: 4 },
    ],
    gapCountries: [
      { name: 'Mexico', femicideRate: '3.4', measuresCount: 2 },
      { name: 'Brazil', femicideRate: '3.1', measuresCount: 1 },
      { name: 'South Africa', femicideRate: '4.2', measuresCount: 2 },
    ],
    contentWarning:
      'Content note: this brief discusses lethal violence against women (femicide).',
  },
];

module.exports = {
  TEMPLATES,
};
  