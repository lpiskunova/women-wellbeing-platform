const PolicyService = require('../services/policies.service');
const ApiError = require('../utils/ApiError');

class PoliciesController {
  /**
   * GET /policies
   * ?locationIso3=FRA&yearFrom=2015&formOfViolence=...
   */
  static async listPolicies(req, res, next) {
    try {
      const {
        locationIso3,
        yearFrom,
        yearTo,
        formOfViolence,
        measureType,
      } = req.query;

      const params = {};

      if (locationIso3) params.locationIso3 = locationIso3;

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

      if (formOfViolence) params.formOfViolence = formOfViolence;
      if (measureType) params.measureType = measureType;

      const data = await PolicyService.listPolicies(params);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = PoliciesController;