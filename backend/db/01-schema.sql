-- TABLES

CREATE TABLE data_sources (
    id           SERIAL PRIMARY KEY,
    code         VARCHAR(40)  NOT NULL UNIQUE,
    name         VARCHAR(160) NOT NULL,
    url          TEXT,
    license      VARCHAR(160),
    last_updated DATE,
    note         TEXT,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE locations (
    id              SERIAL PRIMARY KEY,
    type            VARCHAR(24)  NOT NULL,
    iso3            VARCHAR(10),
    name            VARCHAR(160) NOT NULL,
    region          VARCHAR(80),
    income_group    VARCHAR(40),
    coverage_score  NUMERIC(5,2),
    freshness_score NUMERIC(5,2),
    note            TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_locations_iso3 UNIQUE (iso3)
);

CREATE TABLE indicator_domains (
    id         SERIAL PRIMARY KEY,
    code       VARCHAR(50)  NOT NULL UNIQUE,
    name       VARCHAR(120) NOT NULL,
    note       TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE measurement_units (
    id         SERIAL PRIMARY KEY,
    code       VARCHAR(40) NOT NULL UNIQUE,
    name       VARCHAR(80) NOT NULL,
    symbol     VARCHAR(20),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE genders (
    id         SERIAL PRIMARY KEY,
    code       VARCHAR(12) NOT NULL UNIQUE, 
    label      VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE age_groups (
    id         SERIAL PRIMARY KEY,
    code       VARCHAR(24) NOT NULL UNIQUE,
    label      VARCHAR(80) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE children_counts (
    id         SERIAL PRIMARY KEY,
    code       VARCHAR(12) NOT NULL UNIQUE,
    label      VARCHAR(40) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE household_types (
    id         SERIAL PRIMARY KEY,
    code       VARCHAR(24) NOT NULL UNIQUE,
    label      VARCHAR(60) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE observation_statuses (
    id         SERIAL PRIMARY KEY,
    code       VARCHAR(24) NOT NULL UNIQUE,
    label      VARCHAR(80) NOT NULL,
    note       TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


CREATE TABLE indicators (
    id             SERIAL PRIMARY KEY,
    code           VARCHAR(80)  NOT NULL UNIQUE,
    name           VARCHAR(160) NOT NULL,
    description    TEXT,
    domain_id      INT NOT NULL REFERENCES indicator_domains(id),
    unit_id        INT NOT NULL REFERENCES measurement_units(id),
    data_source_id INT NOT NULL REFERENCES data_sources(id),
    higher_is_better BOOLEAN NOT NULL,
    external_code  VARCHAR(128), 
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE indicator_observations (
    id                    BIGSERIAL PRIMARY KEY,
    location_id           INT NOT NULL REFERENCES locations(id),
    indicator_id          INT NOT NULL REFERENCES indicators(id),
    year                  INT NOT NULL,
    unit_id               INT NOT NULL REFERENCES measurement_units(id),
    value                 NUMERIC(16,4),
    data_source_id        INT NOT NULL REFERENCES data_sources(id),
    gender_id             INT REFERENCES genders(id),
    age_group_id          INT REFERENCES age_groups(id),
    children_count_id     INT REFERENCES children_counts(id),
    household_type_id     INT REFERENCES household_types(id),
    observation_status_id INT REFERENCES observation_statuses(id),
    note                  TEXT,
    created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE policy_records (
    id             BIGSERIAL PRIMARY KEY,
    data_source_id INT NOT NULL REFERENCES data_sources(id),
    location_id    INT NOT NULL REFERENCES locations(id),
    year           INT,
    form_of_violence TEXT,
    measure_type     TEXT,
    title            TEXT,
    description    TEXT,
    source_url     TEXT,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- INDEXES

-- locations
CREATE INDEX idx_locations_iso3   ON locations(iso3);
CREATE INDEX idx_locations_region ON locations(region);

-- indicators
CREATE INDEX idx_indicators_domain ON indicators(domain_id);
CREATE INDEX idx_indicators_code   ON indicators(code);

-- indicator_observations — main fact table
CREATE INDEX idx_obs_indicator_year_location
    ON indicator_observations (indicator_id, year, location_id);

CREATE INDEX idx_obs_location_indicator_year
    ON indicator_observations (location_id, indicator_id, year);

CREATE INDEX idx_obs_indicator_latest
    ON indicator_observations (indicator_id, year DESC);

CREATE INDEX idx_obs_source
    ON indicator_observations (data_source_id);

CREATE INDEX idx_obs_slices
    ON indicator_observations (gender_id, age_group_id, children_count_id, household_type_id);

-- policy_records
CREATE INDEX idx_policy_records_lookup
    ON policy_records (location_id, year, form_of_violence, measure_type);

-- =========================
-- 6. FUNCTIONS & TRIGGERS
-- =========================

-- 6.1 updated_at auto-update on UPDATE
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_set_updated_at_data_sources
    BEFORE UPDATE ON data_sources
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_set_updated_at_locations
    BEFORE UPDATE ON locations
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_set_updated_at_indicator_domains
    BEFORE UPDATE ON indicator_domains
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_set_updated_at_measurement_units
    BEFORE UPDATE ON measurement_units
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_set_updated_at_genders
    BEFORE UPDATE ON genders
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_set_updated_at_age_groups
    BEFORE UPDATE ON age_groups
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_set_updated_at_children_counts
    BEFORE UPDATE ON children_counts
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_set_updated_at_household_types
    BEFORE UPDATE ON household_types
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_set_updated_at_observation_statuses
    BEFORE UPDATE ON observation_statuses
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_set_updated_at_indicators
    BEFORE UPDATE ON indicators
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_set_updated_at_indicator_observations
    BEFORE UPDATE ON indicator_observations
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_set_updated_at_policy_records
    BEFORE UPDATE ON policy_records
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 6.2 Utility: get latest value for indicator+country
CREATE OR REPLACE FUNCTION get_latest_indicator_value(
    p_indicator_code TEXT,
    p_location_iso3  TEXT
)
RETURNS TABLE (
    indicator_code TEXT,
    location_iso3  TEXT,
    year           INT,
    value          NUMERIC,
    unit_code      TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        i.code,
        l.iso3,
        o.year,
        o.value,
        mu.code
    FROM indicators i
    JOIN indicator_observations o ON o.indicator_id = i.id
    JOIN locations            l  ON l.id = o.location_id
    JOIN measurement_units    mu ON mu.id = o.unit_id
    WHERE i.code = p_indicator_code
      AND l.iso3 = p_location_iso3
    ORDER BY o.year DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql STABLE;

-- 6.3 Recalculate coverage/freshness for one location
CREATE OR REPLACE FUNCTION update_location_data_quality(
    p_location_id INT
)
RETURNS VOID AS $$
DECLARE
    v_total_indicators INT;
    v_with_data        INT;
    v_latest_year      INT;
    v_max_year         INT;
BEGIN
    SELECT count(*) INTO v_total_indicators FROM indicators;
    IF v_total_indicators = 0 THEN
        RETURN;
    END IF;

    SELECT count(DISTINCT indicator_id)
    INTO v_with_data
    FROM indicator_observations
    WHERE location_id = p_location_id;

    UPDATE locations
    SET coverage_score = ROUND(100.0 * v_with_data / v_total_indicators, 2)
    WHERE id = p_location_id;

    SELECT max(year)
    INTO v_latest_year
    FROM indicator_observations
    WHERE location_id = p_location_id;

    SELECT max(year)
    INTO v_max_year
    FROM indicator_observations;

    IF v_latest_year IS NULL OR v_max_year IS NULL THEN
        UPDATE locations
        SET freshness_score = NULL
        WHERE id = p_location_id;
    ELSE
        UPDATE locations
        SET freshness_score = GREATEST(0, 100 - 10 * (v_max_year - v_latest_year))
        WHERE id = p_location_id;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- 6.4 Procedure: recalc coverage/freshness for all locations
CREATE OR REPLACE PROCEDURE recalc_all_locations_data_quality()
LANGUAGE plpgsql AS $$
DECLARE
    v_loc_id INT;
BEGIN
    FOR v_loc_id IN SELECT id FROM locations LOOP
        PERFORM update_location_data_quality(v_loc_id);
    END LOOP;
END;
$$;

-- 6.5 Trigger: after changes in indicator_observations update cache
CREATE OR REPLACE FUNCTION trg_indicator_observations_after_change()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        PERFORM update_location_data_quality(NEW.location_id);

    ELSIF TG_OP = 'UPDATE' THEN
        PERFORM update_location_data_quality(NEW.location_id);
        IF NEW.location_id <> OLD.location_id THEN
            PERFORM update_location_data_quality(OLD.location_id);
        END IF;

    ELSIF TG_OP = 'DELETE' THEN
        PERFORM update_location_data_quality(OLD.location_id);
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER indicator_observations_after_change
AFTER INSERT OR UPDATE OR DELETE
ON indicator_observations
FOR EACH ROW EXECUTE FUNCTION trg_indicator_observations_after_change();


-- 1
CREATE OR REPLACE VIEW v_indicator_observations_flat AS
SELECT
    o.id,
    i.code        AS indicator_code,
    l.iso3        AS location_iso3,
    l.name        AS location_name,
    o.year,
    o.value,
    mu.code       AS unit_code,
    ds.code       AS data_source_code,
    g.code        AS gender_code,
    ag.code       AS age_group_code,
    cc.code       AS children_count_code,
    ht.code       AS household_type_code,
    os.code       AS observation_status_code,
    o.note
FROM indicator_observations o
JOIN indicators            i  ON i.id  = o.indicator_id
JOIN locations             l  ON l.id  = o.location_id
JOIN measurement_units     mu ON mu.id = o.unit_id
JOIN data_sources          ds ON ds.id = o.data_source_id
LEFT JOIN genders          g  ON g.id  = o.gender_id
LEFT JOIN age_groups       ag ON ag.id = o.age_group_id
LEFT JOIN children_counts  cc ON cc.id = o.children_count_id
LEFT JOIN household_types  ht ON ht.id = o.household_type_id
LEFT JOIN observation_statuses os ON os.id = o.observation_status_id;


-- 2
CREATE OR REPLACE VIEW v_latest_indicator_values AS
SELECT DISTINCT ON (o.indicator_id, o.location_id)
    i.code        AS indicator_code,
    l.iso3        AS location_iso3,
    l.name        AS location_name,
    o.year,
    o.value,
    mu.code       AS unit_code,
    ds.code       AS data_source_code
FROM indicator_observations o
JOIN indicators        i  ON i.id  = o.indicator_id
JOIN locations         l  ON l.id  = o.location_id
JOIN measurement_units mu ON mu.id = o.unit_id
JOIN data_sources      ds ON ds.id = o.data_source_id
ORDER BY o.indicator_id, o.location_id, o.year DESC;


-- 3
CREATE OR REPLACE VIEW v_location_data_quality AS
SELECT
    l.id,
    l.iso3,
    l.name,
    l.region,
    l.income_group,
    l.coverage_score,
    l.freshness_score
FROM locations l;


-- 4
CREATE OR REPLACE VIEW v_unw_vaw_policies AS
SELECT
    p.id,
    ds.code         AS data_source_code,
    l.iso3          AS location_iso3,
    l.name          AS country,
    l.name          AS location_name,
    p.year,
    p.form_of_violence,
    p.measure_type,
    p.title,
    p.description,
    p.source_url
FROM policy_records p
JOIN locations     l  ON l.id  = p.location_id
JOIN data_sources  ds ON ds.id = p.data_source_id
WHERE ds.code = 'UNW_VAW';
