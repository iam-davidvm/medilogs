const mongoose = require('mongoose');
const { Schema } = mongoose;
const Person = require('./person');

const bloodpressureSchema = new Schema({
  bovendruk: {
    type: Number,
    min: 30,
    max: 250,
    required: true,
  },
  onderdruk: {
    type: Number,
    min: 30,
    max: 250,
    required: true,
  },
  hartslag: {
    type: Number,
    min: 30,
    max: 250,
  },
  tijdstip: {
    type: Date,
    required: true,
  },
  persoon: {
    type: Schema.Types.ObjectId,
    ref: 'Person',
    required: true,
  },
});

module.exports = mongoose.model('Bloodpressure', bloodpressureSchema);
