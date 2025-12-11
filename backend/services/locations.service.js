const { QueryTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const ApiError = require('../utils/ApiError');

class LocationService {
  /**
   * List of locations (countries/missions).
   */
  static async listLocations({ q, region, limit = 50, offset = 0 }) {
    const whereClauses = ['1=1'];
    const params = { limit, offset };

    if (q && q.trim()) {
      params.q = `%${q.trim()}%`;
      whereClauses.push('(name ILIKE :q OR iso3 ILIKE :q)');
    }

    if (region && region.trim()) {
      params.region = region.trim();
      whereClauses.push('region = :region');
    }

    const whereSql = whereClauses.join(' AND ');

    const items = await sequelize.query(
      `
      SELECT
        id,
        type,
        iso3,
        name,
        region,
        income_group,
        coverage_score,
        freshness_score,
        note
      FROM locations
      WHERE ${whereSql}
      ORDER BY name
      LIMIT :limit OFFSET :offset
      `,
      {
        replacements: params,
        type: QueryTypes.SELECT,
      }
    );

    const [countRow] = await sequelize.query(
      `
      SELECT COUNT(*)::INT AS total
      FROM locations
      WHERE ${whereSql}
      `,
      {
        replacements: params,
        type: QueryTypes.SELECT,
      }
    );

    return {
      total: countRow.total,
      items,
    };
  }

  /**
   * Find country by ISO3 (FRA, AFG, ...).
   */
  static async getByIso3(iso3) {
    const [row] = await sequelize.query(
      `
      SELECT
        id,
        type,
        iso3,
        name,
        region,
        income_group,
        coverage_score,
        freshness_score,
        note
      FROM locations
      WHERE iso3 = :iso3
      LIMIT 1
      `,
      {
        replacements: { iso3 },
        type: QueryTypes.SELECT,
      }
    );

    if (!row) {
      throw ApiError.notFound('Location not found');
    }

    return row;
  }
}

module.exports = LocationService;