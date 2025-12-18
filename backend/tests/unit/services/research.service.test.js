const ResearchService = require('../../../services/research.service');
const ApiError = require('../../../utils/ApiError');
const { TEMPLATES } = require('../../../config/research.templates');

describe('ResearchService (unit)', () => {
  describe('listTemplates', () => {
    it('returns a list of short templates without heavy fields', async () => {
      const result = await ResearchService.listTemplates();

      expect(result).toHaveProperty('items');
      expect(Array.isArray(result.items)).toBe(true);

      if (result.items.length > 0) {
        const t = result.items[0];

        expect(t).toHaveProperty('id');
        expect(t).toHaveProperty('title');
        expect(t).toHaveProperty('description');
        expect(t).toHaveProperty('type');
        expect(t).toHaveProperty('topic');
        expect(t).toHaveProperty('years');
        expect(t).toHaveProperty('criteria');
        expect(t).toHaveProperty('lastUpdated');
        expect(t).toHaveProperty('sources');

        expect(t).not.toHaveProperty('results');
        expect(t).not.toHaveProperty('keyFindings');
      }
    });
  });

  describe('getTemplateById', () => {
    it('returns the full template for an existing id', async () => {
      const existingId = TEMPLATES[0].id;

      const result = await ResearchService.getTemplateById(existingId);

      expect(result).toHaveProperty('id', existingId);
      expect(result).toHaveProperty('title', TEMPLATES[0].title);
      expect(result).toHaveProperty('type', TEMPLATES[0].type);
    });

    it('throws ApiError.notFound for a non-existent id', async () => {
      await expect(
        ResearchService.getTemplateById('__unknown__')
      ).rejects.toBeInstanceOf(ApiError);

      await expect(
        ResearchService.getTemplateById('__unknown__')
      ).rejects.toMatchObject({
        statusCode: 404,
        message: 'Research template not found',
      });
    });
  });
});
