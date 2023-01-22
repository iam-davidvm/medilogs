const fs = require('fs/promises');
const { writeFileSync } = require('fs');

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
      });
    })
    .catch((e) => {
      return res.render('admin/maintenance', {
        title: 'Stel een onderhoudsboodschap in',
        message: '',
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
      success: 'De maintenance boodschap werd aangepast',
    });
  } catch (e) {
    return res.render('admin/maintenance', {
      title: 'Stel een onderhoudsboodschap in',
      error: `Er is iets mis gegaan: ${e}`,
    });
  }
};
