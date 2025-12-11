INSERT INTO measurement_units (code, name, symbol) VALUES
  ('PCT',      'Percent',            '%'),
  ('INDEX100', 'Index (0–100)',      NULL),
  ('COUNT',    'Count',              NULL),
  ('RATE_100K','Rate per 100,000',   NULL),
  ('SCORE',    'Score (unitless)',   NULL),
  ('RANK',     'Rank (1 = best)',    NULL)
ON CONFLICT (code) DO NOTHING;


INSERT INTO indicator_domains (code, name, note) VALUES
  ('LEGAL_RIGHTS',        'Legal Rights',              NULL),
  ('ECONOMIC_PARTICIPATION','Economic Participation',  NULL),
  ('HEALTH',              'Health',                    NULL),
  ('SAFETY_VIOLENCE',     'Safety & Violence',         NULL),
  ('POLITICAL_REPRESENT', 'Political Representation',  NULL),
  ('WPS',                 'Women, Peace & Security',   'UN field missions – leadership positions of women'),
  ('LAW_INST',            'Law and institutions',      'Indicators of women''s legal status (WBL)')
ON CONFLICT (code) DO NOTHING;


INSERT INTO genders (code, label) VALUES
  ('FEMALE', 'Women / Female')
ON CONFLICT (code) DO NOTHING;


INSERT INTO age_groups (code, label) VALUES
  ('TOTAL',      'Total'),
  ('PRIME_AGE',  'Prime age (25–54)'),
  ('AGE_0_9',    '0–9 years'),
  ('AGE_10_14',  '10–14 years'),
  ('AGE_15_17',  '15–17 years'),
  ('AGE_18_19',  '18–19 years'),
  ('AGE_20_24',  '20–24 years'),
  ('AGE_25_29',  '25–29 years'),
  ('AGE_30_44',  '30–44 years'),
  ('AGE_45_59',  '45–59 years'),
  ('AGE_60P',    '60 and older')
ON CONFLICT (code) DO NOTHING;


INSERT INTO children_counts (code, label) VALUES
  ('NONE',    '0 children'),
  ('ONE_TWO', '1–2 children'),
  ('THREEP',  '3+ children')
ON CONFLICT (code) DO NOTHING;


INSERT INTO household_types (code, label) VALUES
  ('NUCLEAR',  'Nuclear household'),
  ('EXTENDED', 'Extended household')
ON CONFLICT (code) DO NOTHING;


INSERT INTO observation_statuses (code, label, note) VALUES
  ('NORMAL',   'Normal observation', 'Standard reported value'),
  ('OFFICIAL', 'Official figure',    'Published official statistics')
ON CONFLICT (code) DO NOTHING;



INSERT INTO data_sources (code, name, url) VALUES
  ('UNODC',     'UNODC Homicide / Femicide Data',                 'https://dataunodc.un.org'),
  ('UNW_VAW',   'UN Women Violence Against Women Data Map',       'https://data.unwomen.org'),
  ('UNW_MCW',   'UN Women Marriage, Children & Work',             'https://data.unwomen.org'),
  ('UNW_WPS',   'UN Women – Women, Peace & Security (missions)',  'https://data.unwomen.org'),
  ('WPS',       'GIWPS Women, Peace & Security Index',            'https://giwps.georgetown.edu'),
  ('WBL',       'World Bank – Women, Business and the Law',       'https://wbl.worldbank.org'),
  ('WBL_PANEL', 'World Bank – WBL Panel 1971–2024',               'https://wbl.worldbank.org')
ON CONFLICT (code) DO NOTHING;


INSERT INTO indicators (
    code, name, description,
    domain_id, unit_id, data_source_id,
    higher_is_better, external_code
)
SELECT
  'UNODC_FEMICIDE_COUNT',
  'Number of female victims of intentional homicide',
  'UNODC CTS data, counts of female victims of intentional homicide',
  d.id,
  u.id,
  s.id,
  FALSE,
  'FEMICIDE_COUNT'
FROM indicator_domains d,
     measurement_units u,
     data_sources s
WHERE d.code = 'SAFETY_VIOLENCE'
  AND u.code = 'COUNT'
  AND s.code = 'UNODC'
ON CONFLICT (code) DO NOTHING;



INSERT INTO indicators (
    code, name, description,
    domain_id, unit_id, data_source_id,
    higher_is_better, external_code
)
SELECT
  'UNODC_FEMICIDE_RATE_100K',
  'Female victims of intentional homicide per 100,000 women',
  'UNODC CTS data, rate per 100,000 female population',
  d.id,
  u.id,
  s.id,
  FALSE,
  'FEMICIDE_RATE_100K'
FROM indicator_domains d,
     measurement_units u,
     data_sources s
WHERE d.code = 'SAFETY_VIOLENCE'
  AND u.code = 'RATE_100K'
  AND s.code = 'UNODC'
ON CONFLICT (code) DO NOTHING;


INSERT INTO indicators (
    code, name, description,
    domain_id, unit_id, data_source_id,
    higher_is_better, external_code
)
SELECT
  'UNW_LFPR',
  'Labour force participation rate of women, prime age',
  'Prime-age female labour force participation rate by number of children and household type',
  d.id,
  u.id,
  s.id,
  TRUE,
  'LFPR'
FROM indicator_domains d,
     measurement_units u,
     data_sources s
WHERE d.code = 'ECONOMIC_PARTICIPATION'
  AND u.code = 'PCT'
  AND s.code = 'UNW_MCW'
ON CONFLICT (code) DO NOTHING;


INSERT INTO indicators (
    code, name, description,
    domain_id, unit_id, data_source_id,
    higher_is_better, external_code
)
SELECT
  'UNW_EPR',
  'Employment-to-population ratio of women, prime age',
  'Prime-age female employment-to-population ratio by number of children and household type',
  d.id,
  u.id,
  s.id,
  TRUE,
  'EPR'
FROM indicator_domains d,
     measurement_units u,
     data_sources s
WHERE d.code = 'ECONOMIC_PARTICIPATION'
  AND u.code = 'PCT'
  AND s.code = 'UNW_MCW'
ON CONFLICT (code) DO NOTHING;


INSERT INTO indicators (
    code, name, description,
    domain_id, unit_id, data_source_id,
    higher_is_better, external_code
)
SELECT
  'UNW_WPS_WOMEN_SENIOR_POSITIONS_COUNT',
  'Women in senior positions in UN field missions (count)',
  'Number of women in senior positions, by UN field mission (UN Women WPS, series WPS_9_3)',
  d.id,
  u.id,
  s.id,
  TRUE,
  'WPS_9_3'
FROM indicator_domains d,
     measurement_units u,
     data_sources s
WHERE d.code = 'WPS'
  AND u.code = 'COUNT'
  AND s.code = 'UNW_WPS'
ON CONFLICT (code) DO NOTHING;



INSERT INTO indicators (
    code, name, description,
    domain_id, unit_id, data_source_id,
    higher_is_better, external_code
)
VALUES
  ('WBL_INDEX',
   'WBL Index (0–100)',
   'Composite WBL index (0–100)',
   (SELECT id FROM indicator_domains  WHERE code = 'LAW_INST'),
   (SELECT id FROM measurement_units WHERE code = 'INDEX100'),
   (SELECT id FROM data_sources      WHERE code = 'WBL_PANEL'),
   TRUE,
   'WBL_INDEX'),

  ('WBL_MOBILITY',
   'Mobility score (0–100)',
   'WBL subindex: Mobility',
   (SELECT id FROM indicator_domains  WHERE code = 'LAW_INST'),
   (SELECT id FROM measurement_units WHERE code = 'INDEX100'),
   (SELECT id FROM data_sources      WHERE code = 'WBL_PANEL'),
   TRUE,
   'MOBILITY_SCORE'),

  ('WBL_WORKPLACE',
   'Workplace score (0–100)',
   'WBL subindex: Workplace',
   (SELECT id FROM indicator_domains  WHERE code = 'LAW_INST'),
   (SELECT id FROM measurement_units WHERE code = 'INDEX100'),
   (SELECT id FROM data_sources      WHERE code = 'WBL_PANEL'),
   TRUE,
   'WORKPLACE_SCORE'),

  ('WBL_PAY',
   'Pay score (0–100)',
   'WBL subindex: Pay',
   (SELECT id FROM indicator_domains  WHERE code = 'LAW_INST'),
   (SELECT id FROM measurement_units WHERE code = 'INDEX100'),
   (SELECT id FROM data_sources      WHERE code = 'WBL_PANEL'),
   TRUE,
   'PAY_SCORE'),

  ('WBL_MARRIAGE',
   'Marriage score (0–100)',
   'WBL subindex: Marriage',
   (SELECT id FROM indicator_domains  WHERE code = 'LAW_INST'),
   (SELECT id FROM measurement_units WHERE code = 'INDEX100'),
   (SELECT id FROM data_sources      WHERE code = 'WBL_PANEL'),
   TRUE,
   'MARRIAGE_SCORE'),

  ('WBL_PARENT',
   'Parenthood score (0–100)',
   'WBL subindex: Parenthood',
   (SELECT id FROM indicator_domains  WHERE code = 'LAW_INST'),
   (SELECT id FROM measurement_units WHERE code = 'INDEX100'),
   (SELECT id FROM data_sources      WHERE code = 'WBL_PANEL'),
   TRUE,
   'PARENTHOOD_SCORE'),

  ('WBL_ENTREPRENEUR',
   'Entrepreneurship score (0–100)',
   'WBL subindex: Entrepreneurship',
   (SELECT id FROM indicator_domains  WHERE code = 'LAW_INST'),
   (SELECT id FROM measurement_units WHERE code = 'INDEX100'),
   (SELECT id FROM data_sources      WHERE code = 'WBL_PANEL'),
   TRUE,
   'ENTREPRENEURSHIP_SCORE'),

  ('WBL_ASSETS',
   'Assets score (0–100)',
   'WBL subindex: Assets',
   (SELECT id FROM indicator_domains  WHERE code = 'LAW_INST'),
   (SELECT id FROM measurement_units WHERE code = 'INDEX100'),
   (SELECT id FROM data_sources      WHERE code = 'WBL_PANEL'),
   TRUE,
   'ASSETS_SCORE'),

  ('WBL_PENSION',
   'Pension score (0–100)',
   'WBL subindex: Pension',
   (SELECT id FROM indicator_domains  WHERE code = 'LAW_INST'),
   (SELECT id FROM measurement_units WHERE code = 'INDEX100'),
   (SELECT id FROM data_sources      WHERE code = 'WBL_PANEL'),
   TRUE,
   'PENSION_SCORE')
ON CONFLICT (code) DO NOTHING;