const HealthService = require('../services/health.service');

class HealthController {
  static async getHealth(req, res, next) {
    try {
      const result = await HealthService.getHealth();
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = HealthController;
