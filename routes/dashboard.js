const express = require('express');
const router = express.Router({ mergeParams: true });

const Bloodpressure = require('../models/bloodpressure');

const catchAsync = require('../utils/catchAsync');
const {
  isLoggedIn,
  lastSeen,
  validateBloodpressure,
  isAuthenticated,
} = require('../utils/middleware');

router.get(
  '/',
  isLoggedIn,
  lastSeen,
  catchAsync(async (req, res) => {
    const { patientId } = req.params;
    const lastResult = await Bloodpressure.find({ patient: patientId })
      .sort({ tijdstip: 'desc' })
      .limit(1);
    res.render('dashboard/index', {
      title: 'Mijn dashboard',
      lastResult,
      patientId,
    });
  })
);

module.exports = router;
