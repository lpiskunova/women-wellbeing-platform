const express = require('express');
const IndicatorsController = require('../controllers/indicators.controller');

const router = express.Router();

/**
 * GET /api/indicators
 * query:
 *  - q          (search by code/name)
 *  - domain     (domain code, e.g., WPS, ECONOMIC_PARTICIPATION)
 *  - limit      (default 50)
 *  - offset     (default 0)
 */
router.get('/', IndicatorsController.listIndicators);

/**
 * GET /api/indicators/:code
 * Example: /api/indicators/WBL_INDEX
 */
router.get('/:code', IndicatorsController.getIndicatorByCode);

module.exports = router;
