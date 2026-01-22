-- ---------------------------------------------------------
-- 1. Локации (страны + UN-миссии)
-- ---------------------------------------------------------

INSERT INTO locations (type, iso3, name, region, income_group)
VALUES
    ('country',  'AFG', 'Afghanistan', 'South Asia',            'Low income'),
    ('country',  'FRA', 'France',      'Europe & Central Asia', 'High income'),
    ('country',  'CAN', 'Canada',      'North America',         'High income'),
    ('country',  'CHE', 'Switzerland', 'Europe & Central Asia', 'High income'),
    ('country',  'COL', 'Colombia',    'Latin America & Caribbean', 'Upper middle income'),
    ('country',  'BRA', 'Brazil',      'Latin America & Caribbean', 'Upper middle income')
ON CONFLICT (iso3) DO NOTHING;


-- ---------------------------------------------------------
-- 1b. UN field missions (UN Women WPS dataset, REF_AREA Code = FMxx)
-- ---------------------------------------------------------

INSERT INTO locations (type, iso3, name, region, income_group)
VALUES
    ('un_mission', 'FM1',  'UNOWAS, West Africa and the Sahel', NULL, NULL),
    ('un_mission', 'FM2',  'UNIOGBIS, Guinea-Bissau', NULL, NULL),
    ('un_mission', 'FM3',  'UNOAU, African Union', NULL, NULL),
    ('un_mission', 'FM4',  'UNSOM, Somalia', NULL, NULL),
    ('un_mission', 'FM5',  'UNOCA, Central Africa', NULL, NULL),
    ('un_mission', 'FM6',  'UNSMIL, Libya', NULL, NULL),
    ('un_mission', 'FM7',  'UNSCOL, Lebanon', NULL, NULL),
    ('un_mission', 'FM8',  'UNAMI, Iraq', NULL, NULL),
    ('un_mission', 'FM9',  'UNRCCA, Central Asia', NULL, NULL),
    ('un_mission', 'FM10', 'UNAMA, Afghanistan', NULL, NULL),
    ('un_mission', 'FM11', 'UNSCO, Middle East Peace Process', NULL, NULL),
    ('un_mission', 'FM12', 'UN Verification Mission in Colombia', NULL, NULL),
    ('un_mission', 'FM14', 'Special Envoy Syria', NULL, NULL),
    ('un_mission', 'FM18', 'UNTSO, Middle East', NULL, NULL),
    ('un_mission', 'FM20', 'UNFICYP, Cyprus', NULL, NULL),
    ('un_mission', 'FM21', 'UNDOF, Golan', NULL, NULL),
    ('un_mission', 'FM22', 'UNIFIL, Lebanon', NULL, NULL),
    ('un_mission', 'FM23', 'MINURSO, Western Sahara', NULL, NULL),
    ('un_mission', 'FM24', 'UNMIK, Kosovo', NULL, NULL),
    ('un_mission', 'FM25', 'UNMIL, Liberia', NULL, NULL),
    ('un_mission', 'FM27', 'UNAMID, Darfur', NULL, NULL),
    ('un_mission', 'FM28', 'MONUSCO, D.R. of the Congo', NULL, NULL),
    ('un_mission', 'FM29', 'UNISFA, Abyei', NULL, NULL),
    ('un_mission', 'FM30', 'UNMISS, South Sudan', NULL, NULL),
    ('un_mission', 'FM31', 'MINUSMA, Mali', NULL, NULL),
    ('un_mission', 'FM32', 'MINUSCA, Central African Republic', NULL, NULL)
ON CONFLICT (iso3) DO NOTHING;


-- ---------------------------------------------------------
-- 2. WBL: индекс и подиндексы (LAW_INST / WBL_PANEL)
-- ---------------------------------------------------------

INSERT INTO indicator_observations (
    location_id, indicator_id, year, unit_id, value, data_source_id
)
VALUES
    (
        (SELECT id FROM locations  WHERE iso3 = 'AFG'),
        (SELECT id FROM indicators WHERE code = 'WBL_INDEX'),
        2023,
        (SELECT unit_id        FROM indicators WHERE code = 'WBL_INDEX'),
        26.3,
        (SELECT data_source_id FROM indicators WHERE code = 'WBL_INDEX')
    ),
    (
        (SELECT id FROM locations  WHERE iso3 = 'AFG'),
        (SELECT id FROM indicators WHERE code = 'WBL_MOBILITY'),
        2023,
        (SELECT unit_id        FROM indicators WHERE code = 'WBL_MOBILITY'),
        25.0,
        (SELECT data_source_id FROM indicators WHERE code = 'WBL_MOBILITY')
    ),
    (
        (SELECT id FROM locations  WHERE iso3 = 'FRA'),
        (SELECT id FROM indicators WHERE code = 'WBL_INDEX'),
        2023,
        (SELECT unit_id        FROM indicators WHERE code = 'WBL_INDEX'),
        96.9,
        (SELECT data_source_id FROM indicators WHERE code = 'WBL_INDEX')
    );


INSERT INTO indicator_observations (
    location_id, indicator_id, year, unit_id, value, data_source_id
)
VALUES
    (
        (SELECT id FROM locations  WHERE iso3 = 'AFG'),
        (SELECT id FROM indicators WHERE code = 'WBL_WORKPLACE'),
        2023,
        (SELECT unit_id        FROM indicators WHERE code = 'WBL_WORKPLACE'),
        30.0,
        (SELECT data_source_id FROM indicators WHERE code = 'WBL_WORKPLACE')
    ),
    (
        (SELECT id FROM locations  WHERE iso3 = 'AFG'),
        (SELECT id FROM indicators WHERE code = 'WBL_PAY'),
        2023,
        (SELECT unit_id        FROM indicators WHERE code = 'WBL_PAY'),
        20.0,
        (SELECT data_source_id FROM indicators WHERE code = 'WBL_PAY')
    ),
    (
        (SELECT id FROM locations  WHERE iso3 = 'AFG'),
        (SELECT id FROM indicators WHERE code = 'WBL_MARRIAGE'),
        2023,
        (SELECT unit_id        FROM indicators WHERE code = 'WBL_MARRIAGE'),
        40.0,
        (SELECT data_source_id FROM indicators WHERE code = 'WBL_MARRIAGE')
    ),
    (
        (SELECT id FROM locations  WHERE iso3 = 'AFG'),
        (SELECT id FROM indicators WHERE code = 'WBL_PARENT'),
        2023,
        (SELECT unit_id        FROM indicators WHERE code = 'WBL_PARENT'),
        30.0,
        (SELECT data_source_id FROM indicators WHERE code = 'WBL_PARENT')
    ),
    (
        (SELECT id FROM locations  WHERE iso3 = 'AFG'),
        (SELECT id FROM indicators WHERE code = 'WBL_ENTREPRENEUR'),
        2023,
        (SELECT unit_id        FROM indicators WHERE code = 'WBL_ENTREPRENEUR'),
        40.0,
        (SELECT data_source_id FROM indicators WHERE code = 'WBL_ENTREPRENEUR')
    ),
    (
        (SELECT id FROM locations  WHERE iso3 = 'AFG'),
        (SELECT id FROM indicators WHERE code = 'WBL_ASSETS'),
        2023,
        (SELECT unit_id        FROM indicators WHERE code = 'WBL_ASSETS'),
        25.0,
        (SELECT data_source_id FROM indicators WHERE code = 'WBL_ASSETS')
    ),
    (
        (SELECT id FROM locations  WHERE iso3 = 'AFG'),
        (SELECT id FROM indicators WHERE code = 'WBL_PENSION'),
        2023,
        (SELECT unit_id        FROM indicators WHERE code = 'WBL_PENSION'),
        10.0,
        (SELECT data_source_id FROM indicators WHERE code = 'WBL_PENSION')
    );


INSERT INTO indicator_observations (
    location_id, indicator_id, year, unit_id, value, data_source_id
)
VALUES
    (
        (SELECT id FROM locations  WHERE iso3 = 'FRA'),
        (SELECT id FROM indicators WHERE code = 'WBL_MOBILITY'),
        2023,
        (SELECT unit_id        FROM indicators WHERE code = 'WBL_MOBILITY'),
        100.0,
        (SELECT data_source_id FROM indicators WHERE code = 'WBL_MOBILITY')
    ),
    (
        (SELECT id FROM locations  WHERE iso3 = 'FRA'),
        (SELECT id FROM indicators WHERE code = 'WBL_WORKPLACE'),
        2023,
        (SELECT unit_id        FROM indicators WHERE code = 'WBL_WORKPLACE'),
        100.0,
        (SELECT data_source_id FROM indicators WHERE code = 'WBL_WORKPLACE')
    ),
    (
        (SELECT id FROM locations  WHERE iso3 = 'FRA'),
        (SELECT id FROM indicators WHERE code = 'WBL_PAY'),
        2023,
        (SELECT unit_id        FROM indicators WHERE code = 'WBL_PAY'),
        75.0,
        (SELECT data_source_id FROM indicators WHERE code = 'WBL_PAY')
    ),
    (
        (SELECT id FROM locations  WHERE iso3 = 'FRA'),
        (SELECT id FROM indicators WHERE code = 'WBL_MARRIAGE'),
        2023,
        (SELECT unit_id        FROM indicators WHERE code = 'WBL_MARRIAGE'),
        100.0,
        (SELECT data_source_id FROM indicators WHERE code = 'WBL_MARRIAGE')
    ),
    (
        (SELECT id FROM locations  WHERE iso3 = 'FRA'),
        (SELECT id FROM indicators WHERE code = 'WBL_PARENT'),
        2023,
        (SELECT unit_id        FROM indicators WHERE code = 'WBL_PARENT'),
        80.0,
        (SELECT data_source_id FROM indicators WHERE code = 'WBL_PARENT')
    ),
    (
        (SELECT id FROM locations  WHERE iso3 = 'FRA'),
        (SELECT id FROM indicators WHERE code = 'WBL_ENTREPRENEUR'),
        2023,
        (SELECT unit_id        FROM indicators WHERE code = 'WBL_ENTREPRENEUR'),
        100.0,
        (SELECT data_source_id FROM indicators WHERE code = 'WBL_ENTREPRENEUR')
    ),
    (
        (SELECT id FROM locations  WHERE iso3 = 'FRA'),
        (SELECT id FROM indicators WHERE code = 'WBL_ASSETS'),
        2023,
        (SELECT unit_id        FROM indicators WHERE code = 'WBL_ASSETS'),
        100.0,
        (SELECT data_source_id FROM indicators WHERE code = 'WBL_ASSETS')
    ),
    (
        (SELECT id FROM locations  WHERE iso3 = 'FRA'),
        (SELECT id FROM indicators WHERE code = 'WBL_PENSION'),
        2023,
        (SELECT unit_id        FROM indicators WHERE code = 'WBL_PENSION'),
        100.0,
        (SELECT data_source_id FROM indicators WHERE code = 'WBL_PENSION')
    );

INSERT INTO indicator_observations (
    location_id, indicator_id, year, unit_id, value, data_source_id
)
VALUES
    (
        (SELECT id FROM locations  WHERE iso3 = 'BRA'),
        (SELECT id FROM indicators WHERE code = 'WBL_INDEX'),
        2023,
        (SELECT unit_id        FROM indicators WHERE code = 'WBL_INDEX'),
        88.1,
        (SELECT data_source_id FROM indicators WHERE code = 'WBL_INDEX')
    ),
    (
        (SELECT id FROM locations  WHERE iso3 = 'BRA'),
        (SELECT id FROM indicators WHERE code = 'WBL_MOBILITY'),
        2023,
        (SELECT unit_id        FROM indicators WHERE code = 'WBL_MOBILITY'),
        90.0,
        (SELECT data_source_id FROM indicators WHERE code = 'WBL_MOBILITY')
    ),
    (
        (SELECT id FROM locations  WHERE iso3 = 'BRA'),
        (SELECT id FROM indicators WHERE code = 'WBL_WORKPLACE'),
        2023,
        (SELECT unit_id        FROM indicators WHERE code = 'WBL_WORKPLACE'),
        85.0,
        (SELECT data_source_id FROM indicators WHERE code = 'WBL_WORKPLACE')
    );


-- ---------------------------------------------------------
-- 3. UNODC: фемицид (SAFETY_VIOLENCE / UNODC)
-- ---------------------------------------------------------

INSERT INTO indicator_observations (
    location_id, indicator_id, year, unit_id, value, data_source_id,
    gender_id, age_group_id
)
VALUES
    (
        (SELECT id FROM locations  WHERE iso3 = 'FRA'),
        (SELECT id FROM indicators WHERE code = 'UNODC_FEMICIDE_COUNT'),
        2020,
        (SELECT unit_id        FROM indicators WHERE code = 'UNODC_FEMICIDE_COUNT'),
        80,
        (SELECT data_source_id FROM indicators WHERE code = 'UNODC_FEMICIDE_COUNT'),
        (SELECT id FROM genders    WHERE code = 'FEMALE'),
        (SELECT id FROM age_groups WHERE code = 'TOTAL')
    ),
    (
        (SELECT id FROM locations  WHERE iso3 = 'FRA'),
        (SELECT id FROM indicators WHERE code = 'UNODC_FEMICIDE_RATE_100K'),
        2020,
        (SELECT unit_id        FROM indicators WHERE code = 'UNODC_FEMICIDE_RATE_100K'),
        0.45,
        (SELECT data_source_id FROM indicators WHERE code = 'UNODC_FEMICIDE_RATE_100K'),
        (SELECT id FROM genders    WHERE code = 'FEMALE'),
        (SELECT id FROM age_groups WHERE code = 'TOTAL')
    );


INSERT INTO indicator_observations (
    location_id, indicator_id, year, unit_id, value, data_source_id,
    gender_id, age_group_id
)
VALUES
    (
        (SELECT id FROM locations  WHERE iso3 = 'CAN'),
        (SELECT id FROM indicators WHERE code = 'UNODC_FEMICIDE_COUNT'),
        2019,
        (SELECT unit_id        FROM indicators WHERE code = 'UNODC_FEMICIDE_COUNT'),
        66,
        (SELECT data_source_id FROM indicators WHERE code = 'UNODC_FEMICIDE_COUNT'),
        (SELECT id FROM genders    WHERE code = 'FEMALE'),
        (SELECT id FROM age_groups WHERE code = 'TOTAL')
    ),
    (
        (SELECT id FROM locations  WHERE iso3 = 'CAN'),
        (SELECT id FROM indicators WHERE code = 'UNODC_FEMICIDE_RATE_100K'),
        2019,
        (SELECT unit_id        FROM indicators WHERE code = 'UNODC_FEMICIDE_RATE_100K'),
        0.35,
        (SELECT data_source_id FROM indicators WHERE code = 'UNODC_FEMICIDE_RATE_100K'),
        (SELECT id FROM genders    WHERE code = 'FEMALE'),
        (SELECT id FROM age_groups WHERE code = 'TOTAL')
    ),
    (
        (SELECT id FROM locations  WHERE iso3 = 'CHE'),
        (SELECT id FROM indicators WHERE code = 'UNODC_FEMICIDE_COUNT'),
        2019,
        (SELECT unit_id        FROM indicators WHERE code = 'UNODC_FEMICIDE_COUNT'),
        5,
        (SELECT data_source_id FROM indicators WHERE code = 'UNODC_FEMICIDE_COUNT'),
        (SELECT id FROM genders    WHERE code = 'FEMALE'),
        (SELECT id FROM age_groups WHERE code = 'TOTAL')
    ),
    (
        (SELECT id FROM locations  WHERE iso3 = 'CHE'),
        (SELECT id FROM indicators WHERE code = 'UNODC_FEMICIDE_RATE_100K'),
        2019,
        (SELECT unit_id        FROM indicators WHERE code = 'UNODC_FEMICIDE_RATE_100K'),
        0.25,
        (SELECT data_source_id FROM indicators WHERE code = 'UNODC_FEMICIDE_RATE_100K'),
        (SELECT id FROM genders    WHERE code = 'FEMALE'),
        (SELECT id FROM age_groups WHERE code = 'TOTAL')
    ),
    (
        (SELECT id FROM locations  WHERE iso3 = 'COL'),
        (SELECT id FROM indicators WHERE code = 'UNODC_FEMICIDE_COUNT'),
        2019,
        (SELECT unit_id        FROM indicators WHERE code = 'UNODC_FEMICIDE_COUNT'),
        27,
        (SELECT data_source_id FROM indicators WHERE code = 'UNODC_FEMICIDE_COUNT'),
        (SELECT id FROM genders    WHERE code = 'FEMALE'),
        (SELECT id FROM age_groups WHERE code = 'TOTAL')
    ),
    (
        (SELECT id FROM locations  WHERE iso3 = 'COL'),
        (SELECT id FROM indicators WHERE code = 'UNODC_FEMICIDE_RATE_100K'),
        2019,
        (SELECT unit_id        FROM indicators WHERE code = 'UNODC_FEMICIDE_RATE_100K'),
        0.80,
        (SELECT data_source_id FROM indicators WHERE code = 'UNODC_FEMICIDE_RATE_100K'),
        (SELECT id FROM genders    WHERE code = 'FEMALE'),
        (SELECT id FROM age_groups WHERE code = 'TOTAL')
    );

INSERT INTO indicator_observations (
    location_id, indicator_id, year, unit_id, value, data_source_id,
    gender_id, age_group_id, note
)
SELECT
    (SELECT id FROM locations  WHERE iso3 = 'AFG'),
    (SELECT id FROM indicators WHERE code = 'UNODC_FEMICIDE_COUNT'),
    2020,
    (SELECT unit_id        FROM indicators WHERE code = 'UNODC_FEMICIDE_COUNT'),
    120,
    (SELECT data_source_id FROM indicators WHERE code = 'UNODC_FEMICIDE_COUNT'),
    (SELECT id FROM genders    WHERE code = 'FEMALE'),
    (SELECT id FROM age_groups WHERE code = 'TOTAL'),
    'Sample value for Afghanistan'
WHERE NOT EXISTS (
    SELECT 1
    FROM indicator_observations o
    JOIN locations  l ON l.id = o.location_id
    JOIN indicators i ON i.id = o.indicator_id
    WHERE l.iso3 = 'AFG'
      AND i.code = 'UNODC_FEMICIDE_COUNT'
      AND o.year = 2020
);

INSERT INTO indicator_observations (
    location_id, indicator_id, year, unit_id, value, data_source_id,
    gender_id, age_group_id, note
)
SELECT
    (SELECT id FROM locations  WHERE iso3 = 'AFG'),
    (SELECT id FROM indicators WHERE code = 'UNODC_FEMICIDE_RATE_100K'),
    2020,
    (SELECT unit_id        FROM indicators WHERE code = 'UNODC_FEMICIDE_RATE_100K'),
    0.85,
    (SELECT data_source_id FROM indicators WHERE code = 'UNODC_FEMICIDE_RATE_100K'),
    (SELECT id FROM genders    WHERE code = 'FEMALE'),
    (SELECT id FROM age_groups WHERE code = 'TOTAL'),
    'Sample/demo value for Afghanistan (to populate Compare)'
WHERE NOT EXISTS (
    SELECT 1
    FROM indicator_observations o
    JOIN locations  l ON l.id = o.location_id
    JOIN indicators i ON i.id = o.indicator_id
    WHERE l.iso3 = 'AFG'
      AND i.code = 'UNODC_FEMICIDE_RATE_100K'
      AND o.year = 2020
);

-- ---------------------------------------------------------
-- 4. UN Women MCW: LFPR / EPR по детям и типу домохозяйства
-- ---------------------------------------------------------

INSERT INTO indicator_observations (
    location_id, indicator_id, year, unit_id, value, data_source_id,
    gender_id, age_group_id, children_count_id, household_type_id
)
VALUES
    (
        (SELECT id FROM locations  WHERE iso3 = 'AFG'),
        (SELECT id FROM indicators WHERE code = 'UNW_EPR'),
        2019,
        (SELECT unit_id        FROM indicators WHERE code = 'UNW_EPR'),
        18.5,
        (SELECT data_source_id FROM indicators WHERE code = 'UNW_EPR'),
        (SELECT id FROM genders          WHERE code = 'FEMALE'),
        (SELECT id FROM age_groups       WHERE code = 'PRIME_AGE'),
        (SELECT id FROM children_counts  WHERE code = 'THREEP'),
        (SELECT id FROM household_types  WHERE code = 'EXTENDED')
    ),
    (
        (SELECT id FROM locations  WHERE iso3 = 'AFG'),
        (SELECT id FROM indicators WHERE code = 'UNW_LFPR'),
        2019,
        (SELECT unit_id        FROM indicators WHERE code = 'UNW_LFPR'),
        23.0,
        (SELECT data_source_id FROM indicators WHERE code = 'UNW_LFPR'),
        (SELECT id FROM genders          WHERE code = 'FEMALE'),
        (SELECT id FROM age_groups       WHERE code = 'PRIME_AGE'),
        (SELECT id FROM children_counts  WHERE code = 'THREEP'),
        (SELECT id FROM household_types  WHERE code = 'EXTENDED')
    );

INSERT INTO indicator_observations (
    location_id, indicator_id, year, unit_id, value, data_source_id,
    gender_id, age_group_id, children_count_id, household_type_id
)
VALUES
    (
        (SELECT id FROM locations  WHERE iso3 = 'FRA'),
        (SELECT id FROM indicators WHERE code = 'UNW_LFPR'),
        2019,
        (SELECT unit_id        FROM indicators WHERE code = 'UNW_LFPR'),
        85.0,
        (SELECT data_source_id FROM indicators WHERE code = 'UNW_LFPR'),
        (SELECT id FROM genders          WHERE code = 'FEMALE'),
        (SELECT id FROM age_groups       WHERE code = 'PRIME_AGE'),
        (SELECT id FROM children_counts  WHERE code = 'NONE'),
        (SELECT id FROM household_types  WHERE code = 'NUCLEAR')
    ),
    (
        (SELECT id FROM locations  WHERE iso3 = 'FRA'),
        (SELECT id FROM indicators WHERE code = 'UNW_EPR'),
        2019,
        (SELECT unit_id        FROM indicators WHERE code = 'UNW_EPR'),
        80.0,
        (SELECT data_source_id FROM indicators WHERE code = 'UNW_EPR'),
        (SELECT id FROM genders          WHERE code = 'FEMALE'),
        (SELECT id FROM age_groups       WHERE code = 'PRIME_AGE'),
        (SELECT id FROM children_counts  WHERE code = 'NONE'),
        (SELECT id FROM household_types  WHERE code = 'NUCLEAR')
    ),
    (
        (SELECT id FROM locations  WHERE iso3 = 'BRA'),
        (SELECT id FROM indicators WHERE code = 'UNW_LFPR'),
        2019,
        (SELECT unit_id        FROM indicators WHERE code = 'UNW_LFPR'),
        75.0,
        (SELECT data_source_id FROM indicators WHERE code = 'UNW_LFPR'),
        (SELECT id FROM genders          WHERE code = 'FEMALE'),
        (SELECT id FROM age_groups       WHERE code = 'PRIME_AGE'),
        (SELECT id FROM children_counts  WHERE code = 'ONE_TWO'),
        (SELECT id FROM household_types  WHERE code = 'EXTENDED')
    ),
    (
        (SELECT id FROM locations  WHERE iso3 = 'BRA'),
        (SELECT id FROM indicators WHERE code = 'UNW_EPR'),
        2019,
        (SELECT unit_id        FROM indicators WHERE code = 'UNW_EPR'),
        70.0,
        (SELECT data_source_id FROM indicators WHERE code = 'UNW_EPR'),
        (SELECT id FROM genders          WHERE code = 'FEMALE'),
        (SELECT id FROM age_groups       WHERE code = 'PRIME_AGE'),
        (SELECT id FROM children_counts  WHERE code = 'ONE_TWO'),
        (SELECT id FROM household_types  WHERE code = 'EXTENDED')
    );


-- ---------------------------------------------------------
-- 5. UN Women WPS: женщины в старших позициях
-- ---------------------------------------------------------

INSERT INTO indicator_observations (
    location_id,
    indicator_id,
    year,
    unit_id,
    value,
    data_source_id,
    gender_id
)
SELECT
    l.id AS location_id,
    i.id AS indicator_id,
    2017 AS year,
    i.unit_id AS unit_id,
    v.obs_value::numeric AS value,
    i.data_source_id AS data_source_id,
    (SELECT id FROM genders WHERE code = 'FEMALE') AS gender_id
FROM (VALUES
    ('FM1',  4),
    ('FM2',  3),
    ('FM3',  1),
    ('FM4',  11),
    ('FM5',  2),
    ('FM6',  6),
    ('FM7',  3),
    ('FM8',  6),
    ('FM9',  1),
    ('FM10', 11),
    ('FM11', 1),
    ('FM12', 6),
    ('FM14', 3),
    ('FM18', 3),
    ('FM20', 4),
    ('FM21', 1),
    ('FM22', 4),
    ('FM23', 2),
    ('FM24', 6),
    ('FM25', 6),
    ('FM27', 12),
    ('FM28', 16),
    ('FM29', 2),
    ('FM30', 21),
    ('FM31', 12),
    ('FM32', 14)
) AS v(mission_code, obs_value)
JOIN locations  l ON l.iso3 = v.mission_code AND l.type = 'un_mission'
JOIN indicators i ON i.code = 'UNW_WPS_WOMEN_SENIOR_POSITIONS_COUNT';


-- ---------------------------------------------------------
-- 6. UN Women VAW: примеры записей политики
--   (policy_records используются во view v_unw_vaw_policies)
-- ---------------------------------------------------------

INSERT INTO policy_records (
    data_source_id,
    location_id,
    year,
    form_of_violence,
    measure_type,
    title,
    description,
    source_url
)
VALUES
    (
        (SELECT id FROM data_sources WHERE code = 'UNW_VAW'),
        (SELECT id FROM locations    WHERE iso3 = 'FRA'),
        2015,
        'Violence against women and girls',
        'Laws > Violence against women > Legislation',
        'Law No. 2015-XXXX on combating violence against women',
        NULL,
        NULL
    ),
    (
        (SELECT id FROM data_sources WHERE code = 'UNW_VAW'),
        (SELECT id FROM locations    WHERE iso3 = 'BRA'),
        2012,
        'Violence against women and girls',
        'Services > Social services > Shelter Safe accommodation',
        'Establishment of national network of shelters for women survivors of violence',
        NULL,
        NULL
    ),
    (
        (SELECT id FROM data_sources WHERE code = 'UNW_VAW'),
        (SELECT id FROM locations    WHERE iso3 = 'COL'),
        2013,
        'Domestic violence/Intimate partner violence',
        'Prevention > Awareness-raising Campaigns',
        'National campaign "No more violence against women"',
        NULL,
        NULL
    );


-- ---------------------------------------------------------
-- 7. Пересчёт показателей качества данных (locations)
--   (чтобы заполнить coverage_score и freshness_score)
-- ---------------------------------------------------------

CALL recalc_all_locations_data_quality();
