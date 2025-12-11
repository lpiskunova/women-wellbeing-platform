const express = require('express');
const HealthController = require('../controllers/health.controller');

const router = express.Router();

/**
 * GET /api/health
 */
router.get('/', HealthController.getHealth);

/**
 * GET /api/health/sentry-test
 * It throws an error specifically to test the integration with Sentry.
 */
router.get('/sentry-test', (req, res, next) => {
    const err = new Error('Sentry test error (manual)');
    next(err);
});

module.exports = router;