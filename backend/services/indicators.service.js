const { QueryTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const ApiError = require('../utils/ApiError');

class IndicatorService {
  /**
   * List of indicators.
   */
  static async listIndicators({ q, domainCode, limit = 50, offset = 0 }) {
    const where = ['1=1'];
    const params = { limit, offset };

    if (q && q.trim()) {
      params.q = `%${q.trim()}%`;
      where.push('(i.code ILIKE :q OR i.name ILIKE :q)');
    }

    if (domainCode && domainCode.trim()) {
      params.domainCode = domainCode.trim();
      where.push('d.code = :domainCode');
    }

    const whereSql = where.join(' AND ');

    const items = await sequelize.query(
      `
      SELECT
        i.id,
        i.code,
        i.name,
        i.description,
        i.higher_is_better,
        d.code  AS domain_code,
        d.name  AS domain_name,
        mu.code AS unit_code,
        mu.name AS unit_name,
        mu.symbol,
        ds.code AS source_code,
        ds.name AS source_name,
        ds.url  AS source_url,
        stats.latest_year,
        stats.coverage_count
      FROM indicators i
      JOIN indicator_domains   d  ON d.id  = i.domain_id
      JOIN measurement_units   mu ON mu.id = i.unit_id
      JOIN data_sources        ds ON ds.id = i.data_source_id
      LEFT JOIN (
        SELECT
          indicator_id,
          MAX(year)                   AS latest_year,
          COUNT(DISTINCT location_id) AS coverage_count
        FROM indicator_observations
        GROUP BY indicator_id
      ) stats ON stats.indicator_id = i.id
      WHERE ${whereSql}
      ORDER BY i.code
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
      FROM indicators i
      JOIN indicator_domains d ON d.id = i.domain_id
      WHERE ${whereSql}
      `,
      { replacements: params, type: QueryTypes.SELECT }
    );

    return {
      total: countRow.total,
      items,
    };
  }

  /**
   * One indicator by its code (WBL_INDEX и т.п.).
   */
  static async getByCode(code) {
    const [row] = await sequelize.query(
      `
      SELECT
        i.id,
        i.code,
        i.name,
        i.description,
        i.higher_is_better,
        d.code  AS domain_code,
        d.name  AS domain_name,
        mu.code AS unit_code,
        mu.name AS unit_name,
        mu.symbol,
        ds.code AS source_code,
        ds.name AS source_name,
        ds.url  AS source_url
      FROM indicators i
      JOIN indicator_domains   d  ON d.id  = i.domain_id
      JOIN measurement_units   mu ON mu.id = i.unit_id
      JOIN data_sources        ds ON ds.id = i.data_source_id
      WHERE i.code = :code
      LIMIT 1
      `,
      {
        replacements: { code },
        type: QueryTypes.SELECT,
      }
    );

    if (!row) {
      throw ApiError.notFound('Indicator not found');
    }

    return row;
  }
}

module.exports = IndicatorService;