const express = require('express');
const router = express.Router({ mergeParams: true });
const Bloodpressure = require('../models/bloodpressure');
const Person = require('../models/person');
const bloodpressureController = require('../controllers/bloodpressure');

const catchAsync = require('../utils/catchAsync');
const { isLoggedIn } = require('../utils/middleware');

router
  .route('/nieuw')
  .get(isLoggedIn, bloodpressureController.renderNewBloodpressure);

module.exports = router;
