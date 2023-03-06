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

module.exports.renderAccount = async (req, res) => {
  const { accountId } = req.params;
  const account = await User.find({ _id: accountId });
  const patienten = await Patient.find({ eigenaar: account });
  res.render('user/account', {
    title: 'Mijn account',
    account,
    patienten,
  });
};

module.exports.renderKoppelen = (req, res) => {
  const { accountId } = req.params;
  res.render('user/koppelen', { title: 'Koppel een persoon', accountId });
};

module.exports.koppelAccount = async (req, res) => {
  const { voornaam, familienaam } = req.body.persoon;
  const account = await User.findOne({ _id: accountId });
  if (account.patienten.length === 4) {
    req.flash('error', 'Je hebt al 3 personen gekoppeld');
    return res.redirect(`/${accountId}`);
  }
  const patient = await new Patient({ voornaam, familienaam });
  account.patienten.push(patient);
  patient.eigenaar = account;
  await account.save();
  await patient.save();
  req.flash(
    'success',
    `${voornaam} ${familienaam} werd gekoppeld aan jouw account.`
  );
  return res.redirect(`/${accountId}`);
};
