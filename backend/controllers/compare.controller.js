const CompareService = require('../services/compare.service');
const ApiError = require('../utils/ApiError');

class CompareController {
  /**
   * GET /compare
   * ?indicatorCode=WBL_INDEX&year=2023&locations=AFG,FRA,ESP
   */
  static async compareLocations(req, res, next) {
    try {
      const { indicatorCode, year, locations } = req.query;

      if (!indicatorCode) {
        throw ApiError.badRequest('indicatorCode is required');
      }
      if (!year) {
        throw ApiError.badRequest('year is required');
      }
      if (!locations) {
        throw ApiError.badRequest('locations is required');
      }

      const parsedYear = Number.parseInt(year, 10);
      if (Number.isNaN(parsedYear)) {
        throw ApiError.badRequest('year must be a number');
      }

      const locationIso3List = String(locations)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const data = await CompareService.compareLocations({
        indicatorCode,
        year: parsedYear,
        locationIso3List,
      });

      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = CompareController;