const { QueryTypes } = require('sequelize');
const { sequelize } = require('../config/database');

class PolicyService {
  /**
   * Policies/measures (UN Women VAW).
   */
  static async listPolicies({
    locationIso3,
    yearFrom,
    yearTo,
    formOfViolence,
    measureType,
  }) {
    const where = ['1=1'];
    const replacements = {};

    if (locationIso3) {
      where.push('l.iso3 = :locationIso3');
      replacements.locationIso3 = locationIso3;
    }
    if (yearFrom) {
      where.push('p.year >= :yearFrom');
      replacements.yearFrom = yearFrom;
    }
    if (yearTo) {
      where.push('p.year <= :yearTo');
      replacements.yearTo = yearTo;
    }
    if (formOfViolence) {
      where.push('p.form_of_violence = :formOfViolence');
      replacements.formOfViolence = formOfViolence;
    }
    if (measureType) {
      where.push('p.measure_type = :measureType');
      replacements.measureType = measureType;
    }

    const whereSql = where.join(' AND ');

    const items = await sequelize.query(
      `
      SELECT
        p.id,
        l.iso3 AS location_iso3,
        p.country,
        p.year,
        p.form_of_violence,
        p.measure_type,
        p.title
      FROM v_unw_vaw_policies p
      LEFT JOIN locations l
        ON l.name = p.country
      WHERE ${whereSql}
      ORDER BY p.year DESC, p.form_of_violence
      `,
      {
        replacements,
        type: QueryTypes.SELECT,
      }
    );

    return { items };
  }
}

module.exports = PolicyService;
