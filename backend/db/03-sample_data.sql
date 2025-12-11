-- ---------------------------------------------------------
-- 1. Локации (страны + UN-миссии)
-- ---------------------------------------------------------

INSERT INTO locations (type, iso3, name, region, income_group)
VALUES
    ('country',  'AFG', 'Afghanistan', 'South Asia',            'Low income'),
    ('country',  'FRA', 'France',      'Europe & Central Asia', 'High income'),
    ('un_mission', NULL, 'UNAMA, Afghanistan', NULL, NULL),

    ('country',  'CAN', 'Canada',      'North America',         'High income'),
    ('country',  'CHE', 'Switzerland', 'Europe & Central Asia', 'High income'),
    ('country',  'COL', 'Colombia',    'Latin America & Caribbean', 'Upper middle income'),
    ('country',  'BRA', 'Brazil',      'Latin America & Caribbean', 'Upper middle income')
ON CONFLICT (iso3) DO NOTHING;


INSERT INTO locations (type, iso3, name, region, income_group)
VALUES
    ('un_mission', NULL, 'UNMISS, South Sudan', NULL, NULL)
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
    location_id, indicator_id, year, unit_id, value, data_source_id,
    gender_id
)
VALUES
(
    (SELECT id FROM locations  WHERE name = 'UNAMA, Afghanistan'),
    (SELECT id FROM indicators WHERE code = 'UNW_WPS_WOMEN_SENIOR_POSITIONS_COUNT'),
    2017,
    (SELECT unit_id        FROM indicators WHERE code = 'UNW_WPS_WOMEN_SENIOR_POSITIONS_COUNT'),
    4,
    (SELECT data_source_id FROM indicators WHERE code = 'UNW_WPS_WOMEN_SENIOR_POSITIONS_COUNT'),
    (SELECT id FROM genders WHERE code = 'FEMALE')
);


INSERT INTO indicator_observations (
    location_id, indicator_id, year, unit_id, value, data_source_id,
    gender_id
)
VALUES
(
    (SELECT id FROM locations  WHERE name = 'UNMISS, South Sudan'),
    (SELECT id FROM indicators WHERE code = 'UNW_WPS_WOMEN_SENIOR_POSITIONS_COUNT'),
    2017,
    (SELECT unit_id        FROM indicators WHERE code = 'UNW_WPS_WOMEN_SENIOR_POSITIONS_COUNT'),
    6,
    (SELECT data_source_id FROM indicators WHERE code = 'UNW_WPS_WOMEN_SENIOR_POSITIONS_COUNT'),
    (SELECT id FROM genders WHERE code = 'FEMALE')
);


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
