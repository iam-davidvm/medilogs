const mongoose = require('mongoose');
const { Schema } = mongoose;
const Patient = require('./patient');

const bloodpressureSchema = new Schema({
  bovendruk: {
    type: Number,
    min: 30,
    max: 299,
    required: true,
  },
  onderdruk: {
    type: Number,
    min: 30,
    max: 299,
    required: true,
  },
  hartslag: {
    type: Number,
    min: 30,
    max: 299,
  },
  tijdstip: {
    type: Date,
    required: true,
  },
  patient: {
    type: Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },
});

module.exports = mongoose.model('Bloodpressure', bloodpressureSchema);
