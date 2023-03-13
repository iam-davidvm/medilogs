const express = require('express');
const router = express.Router();

router.route('/page').get((req, res) => {
  res.render('index');
});

module.exports = router;
