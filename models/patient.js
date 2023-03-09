const mongoose = require('mongoose');
const { Schema } = mongoose;
const User = require('./user');
const Bloodpressure = require('../models/bloodpressure');

const patientSchema = new Schema({
  voornaam: {
    type: String,
    required: true,
  },
  familienaam: {
    type: String,
    required: true,
  },
  eigenaar: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

// delete the bloodpressures of a patient
patientSchema.post('findOneAndDelete', async function (patient) {
  await Bloodpressure.deleteMany({ patient: patient._id });
});

module.exports = mongoose.model('Patient', patientSchema);
