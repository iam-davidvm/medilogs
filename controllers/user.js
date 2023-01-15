const User = require('../models/user');
const Person = require('../models/person');

module.exports.renderRegister = (req, res) => {
  res.render('user/registreren', { title: 'Maak een account aan' });
};

module.exports.register = async (req, res, next) => {
  try {
    const { email, voornaam, familienaam, wachtwoord } = req.body;
    const person = await new Person({ voornaam, familienaam });
    const user = new User({ email, voornaam, familienaam, username: email });

    user.personen.push(person);
    person.eigenaar = user;

    const registeredUser = await User.register(user, wachtwoord);

    await person.save();

    req.login(registeredUser, (err) => {
      if (err) return next();
      res.redirect(`/${registeredUser.personen[0]._id}/dashboard/`);
    });
  } catch (e) {
    // res.send(`Niet aangemeld, dit is mijn error ${e.message}`);
    req.flash('error', `Er ging iets fout: ${e.message}`);
    res.redirect('/registreren');
  }
};

module.exports.renderLogin = (req, res) => {
  res.render('user/aanmelden', { title: 'Aanmelden' });
};

module.exports.login = (req, res) => {
  const redirectURL =
    req.session.returnTo || `/${req.user.personen[0]._id}/dashboard/`;
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
