const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, lastSeen, isAdmin } = require('../utils/middleware');

router
  .route('/maintenance')
  .get(isLoggedIn, isAdmin, lastSeen, adminController.renderMaintenance)
  .patch(isLoggedIn, isAdmin, lastSeen, adminController.saveMaintenance);

router
  .route('/users')
  .get(isLoggedIn, isAdmin, lastSeen, catchAsync(adminController.renderUsers));

router
  .route('/users/:id')
  .get(isLoggedIn, isAdmin, lastSeen, catchAsync(adminController.deleteUser)); // to do: add a flash instead of immediately deleting the user
module.exports = router;
