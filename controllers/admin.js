const fs = require('fs/promises');
const { writeFileSync } = require('fs');
const User = require('../models/user');
const Patient = require('../models/patient');
const Bloodpressure = require('../models/bloodpressure');

module.exports.renderMaintenance = (req, res) => {
  let url = `.${process.env.MAINTENANCE}`;
  if (process.env !== 'production') {
    url = `./public/${process.env.MAINTENANCE}`;
  }
  fs.readFile(url)
    .then((data) => {
      const message = JSON.parse(data).messages[0];
      return res.render('admin/maintenance', {
        title: 'Stel een onderhoudsboodschap in',
        message,
        patientId: '',
      });
    })
    .catch((e) => {
      return res.render('admin/maintenance', {
        title: 'Stel een onderhoudsboodschap in',
        message: '',
        patientId: '',
      });
    });
};

module.exports.saveMaintenance = (req, res) => {
  let url = `.${process.env.MAINTENANCE}`;
  if (process.env !== 'production') {
    url = `./public/${process.env.MAINTENANCE}`;
  }
  const { message } = req.body;

  let jsonMsg = {};

  if (message.length !== 0) {
    jsonMsg = {
      messages: [message],
    };
  }

  try {
    writeFileSync(url, JSON.stringify(jsonMsg, null, 2), 'utf8');
    return res.render('admin/maintenance', {
      title: 'Stel een onderhoudsboodschap in',
      message,
      patientId: '',
      success: 'De maintenance boodschap werd aangepast',
    });
  } catch (e) {
    return res.render('admin/maintenance', {
      title: 'Stel een onderhoudsboodschap in',
      patientId: '',
      error: `Er is iets mis gegaan: ${e}`,
    });
  }
};

module.exports.renderUsers = async (req, res) => {
  const { page } = req.query;
  const start = parseInt(page) || 0;
  const end = start + 20;
  const allUsers = await User.find({});

  const users = allUsers.slice(start, end);
  const usersLength = allUsers.length;

  res.render('admin/users', {
    title: 'Overzicht alle users',
    users,
    start,
    usersLength,
    patientId: '',
  });
};

module.exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  // const patients = await Patient.find({ eigenaar: req.user._id });
  // for (let patient of patients) {
  //   await Bloodpressure.deleteMany({
  //     patient: patient._id,
  //   });
  // }
  // await Patient.deleteMany({ eigenaar: req.user._id });
  await User.findByIdAndDelete(id);
  req.flash('success', 'De gebruiker werd verwijderd.');
  res.redirect('/admin/users');
};
