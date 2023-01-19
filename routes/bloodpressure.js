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
} = require('../utils/middleware');

router
  .route('/nieuw')
  .get(isLoggedIn, lastSeen, bloodpressureController.renderNewBloodpressure)
  .post(
    validateBloodpressure,
    isLoggedIn,
    catchAsync(bloodpressureController.addPressure)
  );

router
  .route('/raadplegen')
  .get(isLoggedIn, lastSeen, bloodpressureController.renderConsultation);

router
  .route('/overzicht')
  .get(isLoggedIn, lastSeen, catchAsync(bloodpressureController.showResults));

router
  .route('/:resultId/bewerk')
  .get(
    isLoggedIn,
    lastSeen,
    catchAsync(bloodpressureController.renderEditBloodpressure)
  )
  .patch(
    validateBloodpressure,
    isLoggedIn,
    lastSeen,
    catchAsync(bloodpressureController.editPressure)
  );

router
  .route('/:resultId/verwijder')
  .get(
    isLoggedIn,
    lastSeen,
    catchAsync(bloodpressureController.flashDeletePressure)
  )
  .delete(
    isLoggedIn,
    lastSeen,
    catchAsync(bloodpressureController.deletePressure)
  );

router
  .route('/downloaden')
  .get(isLoggedIn, lastSeen, bloodpressureController.renderDownloadPage);

router
  .route('/downloadbestand')
  .get(
    isLoggedIn,
    lastSeen,
    catchAsync(bloodpressureController.downloadResults)
  );

module.exports = router;
