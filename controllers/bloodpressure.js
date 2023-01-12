const Bloodpressure = require('../models/bloodpressure');
const Person = require('../models/person');

module.exports.renderNewBloodpressure = (req, res) => {
  const { persoonId } = req.params;
  res.render('bloodpressure/nieuw', {
    id: persoonId,
    title: 'Voer uw meting in',
  });
};

module.exports.addPressure = async (req, res) => {
  const { persoonId } = req.params;
  const { onderdruk, bovendruk, hartslag, dag, maand, jaar, uur, min } =
    req.body.bloodpressure;
  const registeredTime = new Date(Date.UTC(jaar, maand, dag, uur, min));
  const bloodpressure = await new Bloodpressure({
    onderdruk: parseInt(onderdruk),
    bovendruk: parseInt(bovendruk),
    hartslag: parseInt(hartslag),
    tijdstip: registeredTime,
    persoon: persoonId,
  });
  console.log(registeredTime);
  console.log(bloodpressure);
  await bloodpressure.save();
  req.flash('success', 'De meting werd succesvol bewaard.');
  res.redirect('/');
};
