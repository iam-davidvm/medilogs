const ExpressError = require('./ExpressError');
const Bloodpressure = require('../models/bloodpressure');
const { bloodpressureSchema } = require('../schemas');

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'Je moet aangemeld zijn om deze pagina te raadplegen');
    return res.redirect('/aanmelden');
  }
  next();
};
