const Bloodpressure = require('../models/bloodpressure');
const Person = require('../models/person');

module.exports.renderNewBloodpressure = (req, res) => {
  const { id } = req.params;
  res.render('bloodpressure/nieuw', { id, title: 'Voer uw meting in' });
};
