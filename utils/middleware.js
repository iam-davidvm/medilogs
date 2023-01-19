const ExpressError = require('./ExpressError');
const Bloodpressure = require('../models/bloodpressure');
const User = require('../models/user');
const { bloodpressureSchema } = require('../schemas');

module.exports.lastSeen = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, {
      laatstGezien: Date.now(),
    });
  } catch (e) {
    console.log(e);
  }
  next();
};

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'Je moet aangemeld zijn om deze pagina te raadplegen');
    return res.redirect('/aanmelden');
  }
  next();
};

module.exports.isAuthenticated = async (req, res, next) => {
  const { persoonId } = req.params;
  const user = await User.find({ _id: req.user._id, personen: persoonId });

  if (user.length === 0) {
    const msg = 'Je hebt geen rechten tot deze pagina.';

    throw new ExpressError(msg, 403);
  } else {
    next();
  }
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
