const express = require('express');
const router = express.Router({ mergeParams: true });
const Bloodpressure = require('../models/bloodpressure');
const Person = require('../models/person');
const bloodpressureController = require('../controllers/bloodpressure');

const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateBloodpressure } = require('../utils/middleware');

router
  .route('/nieuw')
  .get(isLoggedIn, bloodpressureController.renderNewBloodpressure)
  .post(
    validateBloodpressure,
    isLoggedIn,
    catchAsync(bloodpressureController.addPressure)
  );

router
  .route('/raadplegen')
  .get(isLoggedIn, bloodpressureController.renderConsultation);

router
  .route('/overzicht')
  .get(isLoggedIn, catchAsync(bloodpressureController.showResults));

router
  .route('/:resultId/bewerk')
  .get(isLoggedIn, catchAsync(bloodpressureController.renderEditBloodpressure))
  .patch(
    validateBloodpressure,
    isLoggedIn,
    catchAsync(bloodpressureController.editPressure)
  );

router
  .route('/:resultId/verwijder')
  .get(isLoggedIn, catchAsync(bloodpressureController.flashDeletePressure))
  .delete(isLoggedIn, catchAsync(bloodpressureController.deletePressure));

router
  .route('/downloaden')
  .get(isLoggedIn, bloodpressureController.renderDownloadPage);

router
  .route('/downloadbestand')
  .get(isLoggedIn, catchAsync(bloodpressureController.downloadResults));

module.exports = router;
