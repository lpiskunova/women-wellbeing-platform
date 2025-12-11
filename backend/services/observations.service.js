const { QueryTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const ApiError = require('../utils/ApiError');

class ObservationService {
  /**
   * Time series of observations for the selected indicator and country.
   */
  static async getObservations(params) {
    const {
      indicatorCode,
      locationIso3,
      yearFrom,
      yearTo,
      genderCode,
      ageGroupCode,
      childrenCode,
      householdCode,
    } = params;

    // 1. Check that the indicator exists
    const [indicator] = await sequelize.query(
      `
      SELECT
        i.code,
        i.name,
        i.description,
        i.higher_is_better,
        d.code  AS domain_code,
        d.name  AS domain_name,
        mu.code AS unit_code,
        mu.name AS unit_name,
        mu.symbol
      FROM indicators i
      JOIN indicator_domains   d  ON d.id  = i.domain_id
      JOIN measurement_units   mu ON mu.id = i.unit_id
      WHERE i.code = :indicatorCode
      LIMIT 1
      `,
      {
        replacements: { indicatorCode },
        type: QueryTypes.SELECT,
      }
    );

    if (!indicator) {
      throw ApiError.notFound('Indicator not found');
    }

    // 2. Collecting conditions for the view v_indicator_observations_flat
    const where = ['indicator_code = :indicatorCode', 'location_iso3 = :locationIso3'];
    const replacements = { indicatorCode, locationIso3 };

    if (yearFrom) {
      where.push('year >= :yearFrom');
      replacements.yearFrom = yearFrom;
    }
    if (yearTo) {
      where.push('year <= :yearTo');
      replacements.yearTo = yearTo;
    }
    if (genderCode) {
      where.push('gender_code = :genderCode');
      replacements.genderCode = genderCode;
    }
    if (ageGroupCode) {
      where.push('age_group_code = :ageGroupCode');
      replacements.ageGroupCode = ageGroupCode;
    }
    if (childrenCode) {
      where.push('children_count_code = :childrenCode');
      replacements.childrenCode = childrenCode;
    }
    if (householdCode) {
      where.push('household_type_code = :householdCode');
      replacements.householdCode = householdCode;
    }

    const whereSql = where.join(' AND ');

    const items = await sequelize.query(
      `
      SELECT
        id,
        year,
        value,
        note,
        location_iso3,
        location_name,
        unit_code,
        data_source_code,
        gender_code,
        age_group_code,
        observation_status_code
      FROM v_indicator_observations_flat
      WHERE ${whereSql}
      ORDER BY year
      `,
      {
        replacements,
        type: QueryTypes.SELECT,
      }
    );

    return {
      indicator: {
        code: indicator.code,
        name: indicator.name,
        description: indicator.description,
        higher_is_better: indicator.higher_is_better,
        domain: {
          code: indicator.domain_code,
          name: indicator.domain_name,
        },
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

module.exports = ObservationService;