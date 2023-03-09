const express = require('express');
const router = express.Router();

const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, lastSeen, isAccount } = require('../utils/middleware');

const User = require('../models/user');
const userController = require('../controllers/user');

const passport = require('passport');

router
  .route('/registreren')
  .get(userController.renderRegister)
  .post(catchAsync(userController.register));

router
  .route('/aanmelden')
  .get(userController.renderLogin)
  .post(
    passport.authenticate('local', {
      failureFlash: true,
      failureRedirect: '/aanmelden',
      failureMessage: true,
      keepSessionInfo: true,
    }),
    userController.login
  );

router.get('/afmelden', userController.logout);

router
  .route('/wachtwoord-reset')
  .get(userController.renderWachtwoordReset)
  .post(catchAsync(userController.requestWachtwoordReset));

router
  .route('/:accountId')
  .get(
    isLoggedIn,
    catchAsync(isAccount),
    lastSeen,
    catchAsync(userController.renderAccount)
  );

router
  .route('/:accountId/wachtwoord-reset')
  .get(userController.renderNieuwWachtwoord)
  .patch(catchAsync(userController.saveNieuwWachtwoord));

router
  .route('/:accountId/koppelen')
  .get(
    isLoggedIn,
    catchAsync(isAccount),
    lastSeen,
    userController.renderKoppelen
  )
  .post(
    isLoggedIn,
    catchAsync(isAccount),
    lastSeen,
    catchAsync(userController.koppelAccount)
  );

router
  .route('/:accountId/wachtwoord-wijzigen')
  .get(
    isLoggedIn,
    catchAsync(isAccount),
    lastSeen,
    userController.renderWachtwoordWijzigen
  )
  .patch(
    isLoggedIn,
    catchAsync(isAccount),
    lastSeen,
    catchAsync(userController.wachtwoordWijzigen)
  );

router
  .route('/:patientId/verwijderen')
  .get(
    isLoggedIn,
    catchAsync(isAccount),
    lastSeen,
    catchAsync(userController.flashDeletePatient)
  )
  .delete(
    isLoggedIn,
    catchAsync(isAccount),
    lastSeen,
    catchAsync(userController.deletePatient)
  );

module.exports = router;
