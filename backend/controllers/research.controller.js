const ResearchService = require('../services/research.service');
const ApiError = require('../utils/ApiError');

class ResearchController {
  /**
   * GET /research/templates
   */
  static async listTemplates(req, res, next) {
    try {
      const data = await ResearchService.listTemplates();
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /research/templates/:id
   */
  static async getTemplateById(req, res, next) {
    try {
      const { id } = req.params;
      if (!id) {
        throw ApiError.badRequest('template id is required');
      }

      const data = await ResearchService.getTemplateById(id);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ResearchController;