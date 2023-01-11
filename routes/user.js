const express = require('express');
const router = express.Router();

const catchAsync = require('../utils/catchAsync');

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

module.exports = router;
