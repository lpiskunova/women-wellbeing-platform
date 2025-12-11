const { QueryTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const ApiError = require('../utils/ApiError');

class CompareService {
  /**
   * Comparison of several countries by indicator and year.
   */
  static async compareLocations({ indicatorCode, year, locationIso3List }) {
    if (!Array.isArray(locationIso3List) || locationIso3List.length === 0) {
      throw ApiError.badRequest('locations list is required');
    }

    const safeIso3 = locationIso3List.filter((code) =>
      /^[A-Za-z0-9_\-]{2,10}$/.test(code)
    );
    if (safeIso3.length !== locationIso3List.length) {
      throw ApiError.badRequest('Invalid location ISO3 codes');
    }

    // 1. Indicator metadata
    const [indicator] = await sequelize.query(
      `
      SELECT
        i.code,
        i.name,
        i.higher_is_better,
        mu.code AS unit_code,
        mu.name AS unit_name,
        mu.symbol
      FROM indicators i
      JOIN measurement_units mu ON mu.id = i.unit_id
      WHERE i.code = :indicatorCode
      LIMIT 1
      `,
      { replacements: { indicatorCode }, type: QueryTypes.SELECT }
    );

    if (!indicator) {
      throw ApiError.notFound('Indicator not found');
    }

    // 2. Observations on selected countries
    const inClause = safeIso3.map((c) => `'${c}'`).join(', ');

    const rows = await sequelize.query(
      `
      SELECT
        o.id,
        o.year,
        o.value,
        o.note,
        o.location_iso3,
        o.location_name,
        o.unit_code,
        o.data_source_code,
        o.gender_code,
        o.age_group_code,
        o.observation_status_code,
        l.region,
        l.income_group
      FROM v_indicator_observations_flat o
      LEFT JOIN locations l
        ON l.iso3 = o.location_iso3
      WHERE o.indicator_code = :indicatorCode
        AND o.year = :year
        AND o.location_iso3 IN (${inClause})
      ORDER BY
        o.value ${indicator.higher_is_better ? 'DESC' : 'ASC'},
        o.location_name
      `,
      {
        replacements: { indicatorCode, year },
        type: QueryTypes.SELECT,
      }
    );

    const items = rows.map((row, index) => ({
      rank: index + 1,
      year: row.year,
      value: row.value,
      note: row.note,
      status: row.observation_status_code,
      location: {
        iso3: row.location_iso3,
        name: row.location_name,
        region: row.region,
        income_group: row.income_group,
      },
      unit_code: row.unit_code,
      data_source_code: row.data_source_code,
      gender_code: row.gender_code,
      age_group_code: row.age_group_code,
    }));

    return {
      indicator: {
        code: indicator.code,
        name: indicator.name,
        year,
        higher_is_better: indicator.higher_is_better,
        unit: {
          code: indicator.unit_code,
          name: indicator.unit_name,
          symbol: indicator.symbol,
        },
      },
      items,
    };
  }
}

module.exports = CompareService;