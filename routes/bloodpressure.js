const express = require('express');
const router = express.Router({ mergeParams: true });
const Bloodpressure = require('../models/bloodpressure');
const Person = require('../models/person');
const bloodpressureController = require('../controllers/bloodpressure');

const catchAsync = require('../utils/catchAsync');
const {
  isLoggedIn,
  lastSeen,
  validateBloodpressure,
  isAuthenticated,
} = require('../utils/middleware');

router
  .route('/nieuw')
  .get(isLoggedIn, lastSeen, bloodpressureController.renderNewBloodpressure)
  .post(
    validateBloodpressure,
    isLoggedIn,
    catchAsync(isAuthenticated),
    catchAsync(bloodpressureController.addPressure)
  );

router
  .route('/raadplegen')
  .get(
    isLoggedIn,
    catchAsync(isAuthenticated),
    lastSeen,
    bloodpressureController.renderConsultation
  );

router
  .route('/overzicht')
  .get(
    isLoggedIn,
    catchAsync(isAuthenticated),
    lastSeen,
    catchAsync(bloodpressureController.showResults)
  );

router
  .route('/:resultId/bewerk')
  .get(
    isLoggedIn,
    catchAsync(isAuthenticated),
    lastSeen,
    catchAsync(bloodpressureController.renderEditBloodpressure)
  )
  .patch(
    validateBloodpressure,
    isLoggedIn,
    catchAsync(isAuthenticated),
    lastSeen,
    catchAsync(bloodpressureController.editPressure)
  );

router
  .route('/:resultId/verwijder')
  .get(
    isLoggedIn,
    catchAsync(isAuthenticated),
    lastSeen,
    catchAsync(bloodpressureController.flashDeletePressure)
  )
  .delete(
    isLoggedIn,
    catchAsync(isAuthenticated),
    lastSeen,
    catchAsync(bloodpressureController.deletePressure)
  );

router
  .route('/downloaden')
  .get(
    isLoggedIn,
    catchAsync(isAuthenticated),
    lastSeen,
    bloodpressureController.renderDownloadPage
  );

router
  .route('/downloadbestand')
  .get(
    isLoggedIn,
    catchAsync(isAuthenticated),
    lastSeen,
    catchAsync(bloodpressureController.downloadResults)
  );

module.exports = router;
