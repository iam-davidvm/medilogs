const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../utils/middleware');

router.route('/errortest').get(isLoggedIn, (req, res) => {
  req.flash('error', 'This is an errormessage');
  res.redirect('/63c9d540a66776001ef0fd15/dashboard/');
});

module.exports = router;
