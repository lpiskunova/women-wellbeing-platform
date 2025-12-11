const express = require('express');
const LocationsController = require('../controllers/locations.controller');

const router = express.Router();

/**
 * GET /api/locations
 * query:
 *  - q       (optional search by name/ISO3)
 *  - region  (filter by region)
 *  - limit   (default 50)
 *  - offset  (default 0)
 */
router.get('/', LocationsController.listLocations);

/**
 * GET /api/locations/:iso3
 * Example: /api/locations/FRA
 */
router.get('/:iso3', LocationsController.getLocationByIso3);

module.exports = router;
