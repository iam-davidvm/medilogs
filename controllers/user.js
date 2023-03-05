const User = require('../models/user');
const Patient = require('../models/patient');
const catchAsync = require('../utils/catchAsync');
const { ObjectId } = require('mongodb');

module.exports.renderRegister = (req, res) => {
  res.render('user/registreren', { title: 'Maak een account aan' });
};

module.exports.register = async (req, res, next) => {
  try {
    const {
      email,
      voornaam,
      familienaam,
      wachtwoord,
      registratiecode,
      updates,
    } = req.body;
    const wilUpdates = updates ? true : false;
    if (registratiecode !== process.env.BETA_CODE) {
      req.flash('error', 'Dit is niet de juiste registratiecode.');
      return res.redirect('/registreren');
    }
    const patient = await new Patient({ voornaam, familienaam });
    const user = new User({
      email,
      voornaam,
      familienaam,
      username: email,
      wilUpdates,
    });

    user.patienten.push(patient);
    user.rollen.push('betasquad');
    patient.eigenaar = user;

    const registeredUser = await User.register(user, wachtwoord);

    await patient.save();

    req.login(registeredUser, (err) => {
      if (err) return next();
      res.redirect(`/${registeredUser.patienten[0]._id}/dashboard/`);
    });
  } catch (e) {
    req.flash('error', `Er ging iets fout: ${e.message}`);
    res.redirect('/registreren');
  }
};

module.exports.renderLogin = (req, res) => {
  res.render('user/aanmelden', { title: 'Aanmelden' });
};

module.exports.login = (req, res) => {
  const redirectURL =
    req.session.returnTo || `/${req.user.patienten[0]._id}/dashboard/`;
  delete req.session.returnTo;
  res.redirect(redirectURL);
};

module.exports.logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
};

module.exports.renderAccount = catchAsync(async (req, res) => {
  const { accountId } = req.params;
  const account = await User.find({ _id: accountId });
  const patienten = await Patient.find({ eigenaar: account });
  res.render('user/account', {
    title: 'Mijn account',
    account,
    patienten,
  });
});
