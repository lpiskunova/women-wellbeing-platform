const express = require('express');
const PoliciesController = require('../controllers/policies.controller');

const router = express.Router();

/**
 * GET /api/policies
 *
 * query:
 *  - locationIso3   (France → FRA)
 *  - yearFrom       (int)
 *  - yearTo         (int)
 *  - formOfViolence (value from form_of_violence)
 *  - measureType    (value from type_of_measure)
 */
router.get('/', PoliciesController.listPolicies);

module.exports = router;
