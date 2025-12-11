const express = require('express');
const ResearchController = require('../controllers/research.controller');

const router = express.Router();

/**
 * GET /api/research/templates
 * Returns a short list of all research templates/briefs.
 */
router.get('/templates', ResearchController.listTemplates);

/**
 * GET /api/research/templates/:id
 * Example: /api/research/templates/low-pay-gap
 */
router.get('/templates/:id', ResearchController.getTemplateById);

module.exports = router;
