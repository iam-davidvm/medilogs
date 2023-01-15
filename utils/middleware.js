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

module.exports.validateBloodpressure = (req, res, next) => {
  const { error } = bloodpressureSchema.validate(req.body);

  if (error) {
    const msg = error.details.map((el) => el.message).join(',');

    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
