const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const { isLoggedIn, lastSeen } = require('../utils/middleware');

router
  .route('/maintenance')
  .get(isLoggedIn, lastSeen, adminController.renderMaintenance)
  .patch(isLoggedIn, lastSeen, adminController.saveMaintenance);

module.exports = router;
