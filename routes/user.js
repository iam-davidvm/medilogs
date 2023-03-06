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
  .route('/:accountId')
  .get(
    isLoggedIn,
    catchAsync(isAccount),
    lastSeen,
    catchAsync(userController.renderAccount)
  );

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
  .route('/:patientId/verwijderen')
  .get(
    isLoggedIn,
    catchAsync(isAccount),
    lastSeen,
    catchAsync(userController.flashDeletePatient)
  );

module.exports = router;
