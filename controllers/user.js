const User = require('../models/user');
const Token = require('../models/token');
const Patient = require('../models/patient');
const catchAsync = require('../utils/catchAsync');
const { ObjectId } = require('mongodb');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const sgMail = require('@sendgrid/mail');

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
  const account = await User.findOne({ _id: accountId });
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

module.exports.renderWachtwoordWijzigen = (req, res) => {
  const { accountId } = req.params;
  res.render('user/wachtwoordWijzigen', {
    title: 'Wijzig jouw wachtwoord',
    accountId,
  });
};

module.exports.wachtwoordWijzigen = async (req, res) => {
  const { accountId } = req.params;
  const user = await User.findOne({ _id: accountId });
  user.changePassword(req.body.oldPassword, req.body.newPassword, (e) => {
    if (e) {
      if (e.name === 'IncorrectPasswordError') {
        req.flash('error', 'Jouw oud wachtwoord is niet correct.');
        res.redirect(`/${accountId}/wachtwoord-wijzigen`);
      } else {
        req.flash('error', 'Er is iets fout gegaan, probeer opnieuw.');
        res.redirect(`/${accountId}/wachtwoord-wijzigen`);
      }
    } else {
      req.flash('success', 'Jouw wachtwoord is gewijzigd.');
      res.redirect(`/${accountId}`);
    }
  });
};

module.exports.renderWachtwoordReset = (req, res) => {
  res.render('user/wachtwoordReset', { title: 'Vraag wachtwoord reset aan' });
};

module.exports.requestWachtwoordReset = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    req.flash('error', 'We vinden dit e-mailadres niet terug.');
    return res.redirect('/wachtwoord-reset');
  }
  const token = await Token.findOne({ userId: user._id });
  if (token) await token.deleteOne();
  let resetToken = crypto.randomBytes(32).toString('hex');
  const hash = await bcrypt.hash(resetToken, Number(process.env.BCRYPT_SALT));
  await new Token({
    userId: user._id,
    token: hash,
    createdAt: Date.now(),
  }).save();
  let url = 'http://localhost:3000';
  if (process.env.NODE_ENV == 'production') {
    url = process.env.SITE_URL;
  }

  const link = `${url}/${user._id}/wachtwoord-reset?token=${resetToken}`;

  sgMail.setApiKey(process.env.SENDGRID_API);
  const msg = {
    to: email,
    from: 'no-reply@medilogs.be',
    templateId: 'd-3520c4e280934d779eec5f969007f9fa',
    dynamic_template_data: {
      subject: 'medilogs - Aanvraag wachtwoord resetten',
      url: link,
    },
  };

  sgMail.send(msg).then(
    () => {
      req.flash(
        'success',
        'U ontvangt binnen enkele ogenblikken een e-mail met instructies.'
      );
      return res.redirect('/aanmelden');
    },
    (error) => {
      req.flash(
        'Er ging iets mis met het verzenden van de wachtwoordlink, probeer nogmaals.'
      );
      return res.redirect('/wachtwoord-reset');
    }
  );
};

module.exports.renderNieuwWachtwoord = (req, res) => {
  const { accountId } = req.params;
  const { token } = req.query;
  res.render('user/nieuwWachtwoord', {
    title: 'Nieuw wachtwoord instellen',
    accountId,
    token,
  });
};

module.exports.saveNieuwWachtwoord = async (req, res) => {
  const { accountId } = req.params;
  const { token } = req.query;
  const { password } = req.body;
  const passwordResetToken = await Token.findOne({ userId: accountId });
  if (!passwordResetToken) {
    req.flash(
      'error',
      'De gebruikte token is foutief of vervallen, probeer opnieuw.'
    );
    return res.redirect('/wachtwoord-reset');
  }

  const isValid = await bcrypt.compare(token, passwordResetToken.token);
  if (!isValid) {
    req.flash(
      'error',
      'De gebruikte token is foutief of vervallen, probeer opnieuw.'
    );
    return res.redirect('/wachtwoord-reset');
  }

  let url = 'http://localhost:3000';
  if (process.env.NODE_ENV == 'production') {
    url = process.env.SITE_URL;
  }

  User.findOne({ _id: accountId })
    .then((user) => {
      user.setPassword(password, function (e, user) {
        if (e) {
          req.flash(
            'error',
            'Jouw nieuw wachtwoord kon niet bewaard worden, probeer opnieuw.'
          );
          return res.redirect(
            `${url}/${accountId}/wachtwoord-reset?token=${token}`
          );
        } else {
          user.save();
          req.flash('success', 'Jouw wachtwoord is aangepast.');
          return res.redirect('/aanmelden');
        }
      });
    })
    .catch((e) => {
      req.flash('error', e);
      return res.redirect(
        `${url}/${accountId}/wachtwoord-reset?token=${token}`
      );
    });
  // VOLGENDE STAP IS WACHTWOORD SAVE STOREN (ZIE STACKOVERFLOW) EN DAN CODE VAN LOGROCKET OPNIEUW VOLGEN
  // console.log(accountId, token, password);
  // res.redirect('/');
};

module.exports.flashDeletePatient = async (req, res) => {
  const { patientId } = req.params;
  const patient = await Patient.findOne({ _id: patientId });
  req.flash('warningPatient', {
    eigenaar: patient.eigenaar,
    voornaam: patient.voornaam,
    familienaam: patient.familienaam,
    patientId,
  });
  res.redirect(`/${patient.eigenaar}`);
};

module.exports.deletePatient = async (req, res) => {
  const { patientId } = req.params;
  const patient = await Patient.findOne({ _id: patientId });
  await Patient.findByIdAndDelete(patientId);
  req.flash(
    'success',
    `${patient.voornaam + ' ' + patient.familienaam} werd ontkoppeld.`
  );
  res.redirect(`/${patient.eigenaar}`);
};
