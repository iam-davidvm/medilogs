const mongoose = require('mongoose');
const { Schema } = mongoose;
const User = require('./user');

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

module.exports = mongoose.model('Patient', patientSchema);
