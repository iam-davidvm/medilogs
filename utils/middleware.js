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

// NA TE LEZEN: https://softchris.github.io/pages/joi.html#introducing-joi
// werken met bloodpressure[]?
module.exports.validateBloodpressure = (req, res, next) => {
  // ZOU DE ISSUE TE MAKEN KUNNEN HEBBEN MET HET FEIT DAT IK MIN EN MAX HEB, MAAR DAT HET GEEN NUMMER IS
  const error = bloodpressureSchema.validate(req.body);
  console.log('error: ', error);
  console.log('error.details: ', error.details);
  if (error.details) {
    // IN VB IS HET HIER GEWOON ERROR
    const msg = error.details.map((el) => el.message).join(',');
    console.log(msg);
    throw new ExpressError(msg, 400);
    req.flash('error', msg);
    res.redirect('/'); // moet nog naar error page gaan
  } else {
    next();
  }
};
