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
  const { bovendruk, onderdruk, hartslag, dag, maand, jaar, uur, min } =
    req.body.bloodpressure;
  const registeredTime = new Date(jaar, maand, dag, uur, min);
  const bloodpressure = await new Bloodpressure({
    onderdruk: parseInt(onderdruk),
    bovendruk: parseInt(bovendruk),
    // hartslag: parseInt(hartslag),
    tijdstip: registeredTime,
    persoon: persoonId,
  });
  if (hartslag) {
    bloodpressure.hartslag = parseInt(hartslag);
  }
  await bloodpressure.save();
  req.flash('success', 'De meting werd succesvol bewaard.');
  res.redirect(`/${persoonId}/dashboard/`);
};

module.exports.renderConsultation = (req, res) => {
  const { persoonId } = req.params;
  res.render('bloodpressure/index', {
    title: 'Metingen raadplegen',
    persoonId,
  });
};

module.exports.showResults = async (req, res) => {
  let amount = 30;
  let sortOption = { tijdstip: 'desc' };
  const { persoonId } = req.params;
  const { days, sort } = req.query;
  if (days) {
    amount = days;
  }
  const results = await Bloodpressure.find({ persoon: persoonId })
    .sort({ tijdstip: 'desc' })
    .limit(amount);
  // console.log(results);
  res.render('bloodpressure/results', {
    title: `Overzicht laatste ${amount} metingen`,
    results,
    persoonId,
    sort,
    amount,
  });
};

module.exports.renderEditBloodpressure = async (req, res) => {
  const { persoonId, resultId } = req.params;
  const result = await Bloodpressure.findById(resultId);
  // return res.send(result);
  res.render('bloodpressure/edit', {
    title: 'Pas meting aan',
    persoonId,
    result,
  });
};

module.exports.editPressure = async (req, res) => {
  const { persoonId, resultId } = req.params;
  const { bovendruk, onderdruk, hartslag, dag, maand, jaar, uur, min } =
    req.body.bloodpressure;
  const registeredTime = new Date(jaar, maand, dag, uur, min);
  await Bloodpressure.findByIdAndUpdate(resultId, {
    onderdruk: parseInt(onderdruk),
    bovendruk: parseInt(bovendruk),
    tijdstip: registeredTime,
  });
  if (hartslag) {
    await Bloodpressure.findByIdAndUpdate(resultId, {
      hartslag: parseInt(hartslag),
    });
  }
  req.flash('success', 'De meting werd succesvol aangepast.');
  res.redirect(`/${persoonId}/bloeddruk/overzicht`);
};
