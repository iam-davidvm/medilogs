const Bloodpressure = require('../models/bloodpressure');
// const Patient = require('../models/patient');      // BIG UPDATENIET MEER NODIG????
const excelJS = require('exceljs');

module.exports.renderNewBloodpressure = (req, res) => {
  const { patientId } = req.params;
  res.render('bloodpressure/nieuw', {
    id: patientId,
    title: 'Voer uw meting in',
  });
};

module.exports.addPressure = async (req, res) => {
  const { patientId } = req.params;
  const { bovendruk, onderdruk, hartslag, dag, maand, jaar, uur, min } =
    req.body.bloodpressure;
  const registeredTime = new Date(jaar, maand, dag, uur, min);
  const bloodpressure = await new Bloodpressure({
    onderdruk: parseInt(onderdruk),
    bovendruk: parseInt(bovendruk),
    // hartslag: parseInt(hartslag),
    tijdstip: registeredTime,
    patient: patientId,
  });
  if (hartslag) {
    bloodpressure.hartslag = parseInt(hartslag);
  }
  await bloodpressure.save();
  req.flash('success', 'De meting werd succesvol bewaard.');
  res.redirect(`/${patientId}/dashboard/`);
};

module.exports.renderConsultation = (req, res) => {
  const { patientId } = req.params;
  res.render('bloodpressure/index', {
    title: 'Metingen raadplegen',
    patientId,
  });
};

module.exports.showResults = async (req, res) => {
  let amount = '30';
  let sortOption = { tijdstip: 'desc' };
  const { patientId } = req.params;
  const { days, sort } = req.query;
  if (days) {
    amount = days;
  }
  const results = await Bloodpressure.find({ patient: patientId })
    .sort({ tijdstip: 'desc' })
    .limit(amount);
  if (results.length === 0) {
    return res.render('bloodpressure/noresults', {
      title: 'Geen metingen gevonden',
      patientId,
    });
  }
  res.render('bloodpressure/results', {
    title: `Overzicht laatste ${amount} metingen`,
    results,
    patientId,
    sort,
    amount,
  });
};

module.exports.renderEditBloodpressure = async (req, res) => {
  const { patientId, resultId } = req.params;
  const result = await Bloodpressure.findById(resultId);
  // return res.send(result);
  res.render('bloodpressure/edit', {
    title: 'Pas meting aan',
    patientId,
    result,
  });
};

module.exports.editPressure = async (req, res) => {
  const { patientId, resultId } = req.params;
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
  res.redirect(`/${patientId}/bloeddruk/overzicht`);
};

module.exports.flashDeletePressure = async (req, res) => {
  const { patientId, resultId } = req.params;
  const result = await Bloodpressure.findById(resultId);
  const date = result.tijdstip;
  req.flash('warning', {
    resultId,
    date,
    patientId,
  });
  res.redirect(`/${patientId}/bloeddruk/overzicht`);
};

module.exports.deletePressure = async (req, res) => {
  const { patientId, resultId } = req.params;
  await Bloodpressure.findByIdAndDelete(resultId);
  req.flash('success', 'De meting werd verwijderd.');
  res.redirect(`/${patientId}/bloeddruk/overzicht`);
};

module.exports.renderDownloadPage = (req, res) => {
  const { patientId } = req.params;
  res.render('bloodpressure/download', {
    title: 'Download metingen',
    patientId,
  });
};

module.exports.downloadResults = async (req, res) => {
  const { patientId } = req.params;
  const workbook = new excelJS.Workbook();
  const worksheet = workbook.addWorksheet('Mijn metingen', {
    views: [{ state: 'frozen', ySplit: 1 }],
    properties: { defaultRowHeight: 20 },
  });

  worksheet.columns = [
    { header: 'Bovendruk', key: 'bovendruk', width: 15 },
    { header: 'Onderdruk', key: 'onderdruk', width: 15 },
    { header: 'Hartslag', key: 'hartslag', width: 15 },
    { header: 'Tijdstip', key: 'tijdstip', width: 20 },
  ];

  const yearAgo = new Date(
    new Date().setFullYear(new Date().getFullYear() - 1)
  );
  const results = await Bloodpressure.find({
    patient: patientId,
    tijdstip: { $gte: yearAgo },
  }).sort({ tijdstip: 'desc' });

  if (results.length === 0) {
    return res.render('bloodpressure/noresults', {
      title: 'Geen metingen gevonden',
      patientId,
    });
  }

  results.forEach((result) => {
    const date = result.tijdstip;
    worksheet.addRow({
      bovendruk: result.bovendruk,
      onderdruk: result.onderdruk,
      hartslag: result.hartslag,
      tijdstip: new Date(
        Date.UTC(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          date.getHours(),
          date.getMinutes(),
          date.getSeconds()
        )
      ),
    });
  });

  // layout first column
  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'ffffff' } };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ff6e6b' },
    };
  });

  worksheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
    if (rowNumber === 1) {
      return;
    }

    if (rowNumber % 2 === 0) {
      worksheet.getRow(rowNumber).eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'fbdcd9' },
        };
      });
    } else {
      worksheet.getRow(rowNumber).eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'fe9794' },
        };
      });
    }
  });

  worksheet.autoFilter = 'A1:D1';

  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );
  res.setHeader(
    'Content-Disposition',
    'attachment; filename=' + 'metingen.xlsx'
  );
  try {
    workbook.xlsx.write(res).then(function (data) {
      res.end();
    });
  } catch (e) {
    req.flash(
      'error',
      'Er ging iets fout, geef een seintje als dit probleem aanhoudt.'
    );
    return res.redirect(`/${patientId}/bloeddruk/raadplegen`);
  }
};
