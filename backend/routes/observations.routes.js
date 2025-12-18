const express = require('express');
const ObservationsController = require('../controllers/observations.controller');

const router = express.Router();

/**
 * GET /api/observations
 *
 * query:
 *  - indicatorCode  * (example: WBL_INDEX)
 *  - locationIso3   * (example: FRA)
 *  - yearFrom       (int)
 *  - yearTo         (int)
 *  - gender         (code from genders: FEMALE / MALE / BOTH)
 *  - ageGroup       (code from age_groups)
 *  - children       (code from children_counts)
 *  - household      (code from household_types)
 */
router.get('/', ObservationsController.getObservations);

router.get('/rankings', ObservationsController.getRankings);

module.exports = router;
