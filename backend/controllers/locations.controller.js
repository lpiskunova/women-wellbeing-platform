const LocationService = require('../services/locations.service');
const ApiError = require('../utils/ApiError');

class LocationsController {
  /**
   * GET /locations
   * ?q=fra&region=Europe&limit=20&offset=0
   */
  static async listLocations(req, res, next) {
    try {
      const {
        q,
        region,
        limit = '50',
        offset = '0',
      } = req.query;

      const parsedLimit = Number.parseInt(limit, 10);
      const parsedOffset = Number.parseInt(offset, 10);

      if (Number.isNaN(parsedLimit) || Number.isNaN(parsedOffset)) {
        throw ApiError.badRequest('limit and offset must be numbers');
      }

      const data = await LocationService.listLocations({
        q,
        region,
        limit: parsedLimit,
        offset: parsedOffset,
      });

      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /locations/:iso3
   */
  static async getLocationByIso3(req, res, next) {
    try {
      const iso3 = req.params.iso3;

      if (!iso3) {
        throw ApiError.badRequest('iso3 is required');
      }

      const data = await LocationService.getByIso3(iso3);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = LocationsController;
