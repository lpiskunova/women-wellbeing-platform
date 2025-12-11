const express = require('express');

const healthRoutes = require('./health.routes');
const locationsRoutes = require('./locations.routes');
const indicatorsRoutes = require('./indicators.routes');
const observationsRoutes = require('./observations.routes');
const compareRoutes = require('./compare.routes');
const policiesRoutes = require('./policies.routes');
const researchRoutes = require('./research.routes');
const cache = require('../middlewares/cache.middleware');

const router = express.Router();

// /api/health
router.use('/health', healthRoutes);

// /api/locations, /api/locations/:iso3
router.use('/locations', cache(300), locationsRoutes);

// /api/indicators, /api/indicators/:code
router.use('/indicators', cache(300), indicatorsRoutes);

// /api/observations
router.use('/observations', cache(300), observationsRoutes);

// /api/compare
router.use('/compare', cache(300), compareRoutes);

// /api/policies
router.use('/policies', cache(600), policiesRoutes);

// /api/research/...
router.use('/research', cache(600), researchRoutes);

module.exports = router;
