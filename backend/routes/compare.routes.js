const express = require('express');
const CompareController = require('../controllers/compare.controller');

const router = express.Router();

/**
 * GET /api/compare
 *
 * query:
 *  - indicatorCode * (example: WBL_INDEX)
 *  - year          * (year, int)
 *  - locations     * ("AFG,FRA,ESP")
 */
router.get('/', CompareController.compareLocations);

module.exports = router;
