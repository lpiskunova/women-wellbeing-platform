const IndicatorService = require('../services/indicators.service');
const ApiError = require('../utils/ApiError');

class IndicatorsController {
  /**
   * GET /indicators
   * ?q=wbl&domain=WPS&limit=50&offset=0
   */
  static async listIndicators(req, res, next) {
    try {
      const {
        q,
        domain: domainCode,
        limit = '50',
        offset = '0',
      } = req.query;

      const parsedLimit = Number.parseInt(limit, 10);
      const parsedOffset = Number.parseInt(offset, 10);

      if (Number.isNaN(parsedLimit) || Number.isNaN(parsedOffset)) {
        throw ApiError.badRequest('limit and offset must be numbers');
      }

      const data = await IndicatorService.listIndicators({
        q,
        domainCode,
        limit: parsedLimit,
        offset: parsedOffset,
      });

      const items = data.items.map((row) => ({
        id: row.id,
        code: row.code,
        name: row.name,
        description: row.description,
        higher_is_better: row.higher_is_better,
        domain: {
          code: row.domain_code,
          name: row.domain_name,
        },
        unit: {
          code: row.unit_code,
          name: row.unit_name,
          symbol: row.symbol,
        },
        source: {
          code: row.source_code,
          name: row.source_name,
          url: row.source_url,
        },
      }));

      res.status(200).json({
        total: data.total,
        items,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /indicators/:code
   */
  static async getIndicatorByCode(req, res, next) {
    try {
      const { code } = req.params;
      if (!code) {
        throw ApiError.badRequest('indicator code is required');
      }

      const data = await IndicatorService.getByCode(code);

      const indicator = {
        id: data.id,
        code: data.code,
        name: data.name,
        description: data.description,
        higher_is_better: data.higher_is_better,
        domain: {
          code: data.domain_code,
          name: data.domain_name,
        },
        unit: {
          code: data.unit_code,
          name: data.unit_name,
          symbol: data.symbol,
        },
        source: {
          code: data.source_code,
          name: data.source_name,
          url: data.source_url,
        },
      };

      res.status(200).json(indicator);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = IndicatorsController;