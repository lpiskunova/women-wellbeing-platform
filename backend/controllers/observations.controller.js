const ObservationService = require('../services/observations.service');
const ApiError = require('../utils/ApiError');

class ObservationsController {
  /**
   * GET /observations
   * ?indicatorCode=WBL_INDEX&locationIso3=AFG&yearFrom=2010&yearTo=2023
   */
  static async getObservations(req, res, next) {
    try {
      const {
        indicatorCode,
        locationIso3,
        yearFrom,
        yearTo,
        gender,
        ageGroup,
        children,
        household,
      } = req.query;

      if (!indicatorCode || !locationIso3) {
        throw ApiError.badRequest(
          'indicatorCode and locationIso3 are required'
        );
      }

      const params = {
        indicatorCode,
        locationIso3,
      };

      if (yearFrom) {
        const yf = Number.parseInt(yearFrom, 10);
        if (Number.isNaN(yf)) {
          throw ApiError.badRequest('yearFrom must be a number');
        }
        params.yearFrom = yf;
      }

      if (yearTo) {
        const yt = Number.parseInt(yearTo, 10);
        if (Number.isNaN(yt)) {
          throw ApiError.badRequest('yearTo must be a number');
        }
        params.yearTo = yt;
      }

      if (gender) params.genderCode = gender;
      if (ageGroup) params.ageGroupCode = ageGroup;
      if (children) params.childrenCode = children;
      if (household) params.householdCode = household;

      const data = await ObservationService.getObservations(params);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

    /**
     * GET /observations/rankings
     * ?indicatorCode=WBL_INDEX&limit=50
     */
    static async getRankings(req, res, next) {
      try {
        const { indicatorCode, limit = '200' } = req.query;
  
        if (!indicatorCode) {
          throw ApiError.badRequest('indicatorCode is required');
        }
  
        const parsedLimit = Number.parseInt(limit, 10);
        if (Number.isNaN(parsedLimit)) {
          throw ApiError.badRequest('limit must be a number');
        }
  
        const data = await ObservationService.getIndicatorRankings({
          indicatorCode,
          limit: parsedLimit,
        });
  
        res.status(200).json(data);
      } catch (err) {
        next(err);
      }
    }  
}

module.exports = ObservationsController;
