const ApiError = require('../utils/ApiError');
const { TEMPLATES } = require('../config/research.templates');

class ResearchService {
  /**
   * Short list for the Research page (without heavy tables).
   */
  static async listTemplates() {
    const items = TEMPLATES.map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      type: t.type,
      topic: t.topic,
      years: t.years,
      criteria: t.criteria,
      lastUpdated: t.lastUpdated,
      sources: t.sources,
    }));

    return { items };
  }

  /**
   * Full template/brief object by id (with results table or keyFindings).
   */
  static async getTemplateById(id) {
    const template = TEMPLATES.find((t) => t.id === id);
    if (!template) {
      throw ApiError.notFound('Research template not found');
    }
    return template;
  }
}

module.exports = ResearchService;