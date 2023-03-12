const ExpressError = require('./ExpressError');
const Bloodpressure = require('../models/bloodpressure');
const User = require('../models/user');
const Patient = require('../models/patient');
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
    req.flash('error', 'Je moet aangemeld zijn om deze pagina te raadplegen.');
    return res.redirect('/aanmelden');
  } else if (!req.user.isActive) {
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'Jouw account is nog niet geactiveerd.');
    return res.redirect('/aanmelden');
  }
  next();
};

module.exports.isAuthenticated = async (req, res, next) => {
  const { patientId } = req.params;
  const user = await User.find({ _id: req.user._id, patienten: patientId });

  if (user.length === 0) {
    const msg = 'Je hebt geen rechten tot deze pagina.';

    throw new ExpressError(msg, 403);
  } else {
    next();
  }
};

module.exports.isAccount = async (req, res, next) => {
  const { accountId } = req.params;
  if (typeof accountId !== 'undefined') {
    const account = await User.findOne({ _id: accountId });
    if (String(req.user._id) !== String(account._id)) {
      const msg = 'Je hebt geen rechten tot deze pagina.';

      throw new ExpressError(msg, 403);
    } else {
      next();
    }
  } else {
    const { patientId } = req.params;
    const patient = await Patient.findOne({ _id: patientId });
    if (String(req.user._id) !== String(patient.eigenaar)) {
      const msg = 'Je hebt geen rechten tot deze pagina.';

      throw new ExpressError(msg, 403);
    } else {
      next();
    }
  }
};

module.exports.isAdmin = (req, res, next) => {
  if (!req.user.rollen.includes('admin')) {
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
