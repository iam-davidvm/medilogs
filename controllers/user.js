const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
  res.render('user/registreren', { title: 'Maak een account aan' });
};
