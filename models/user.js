const mongoose = require('mongoose');
const { Schema } = mongoose;
const Patient = require('../models/patient');
const Bloodpressure = require('../models/bloodpressure');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  voornaam: {
    type: String,
    required: true,
  },
  familienaam: {
    type: String,
    required: true,
  },
  patienten: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Patient',
    },
  ],
  laatstGezien: {
    type: Date,
  },
  rollen: {
    type: [String],
  },
  wilUpdates: {
    type: Boolean,
  },
  isActive: {
    type: Boolean,
  },
});

// https://stackoverflow.com/a/45602063
const options = {
  errorMessages: {
    MissingPasswordError: 'Er was geen wachtwoord ingevuld.',
    AttemptTooSoonError:
      'Account is momenteel geblokkeerd. Probeer later opnieuw.',
    TooManyAttemptsError:
      'Account is geblokkeerd omwille van te veel mislukte pogingen.',
    NoSaltValueStoredError: 'Authenticatie niet mogelijk.',
    IncorrectPasswordError: 'Het e-mailadres of wachtwoord zijn niet correct.',
    IncorrectUsernameError: 'Het e-mailadres of wachtwoord zijn niet correct.',
    MissingUsernameError: 'Er was geen e-mailadres ingevuld',
    UserExistsError: 'Er bestaat al een gebruiker met dit e-mailadres.',
  },
  populateFields: 'patienten',
};

userSchema.plugin(passportLocalMongoose, options);

// check if email exists
userSchema.post('save', function (err, doc, next) {
  if (
    error.name === 'MongoServerError' &&
    error.code === 11000 &&
    error.keyValue.email
  ) {
    next(new Error('Er bestaat al een gebruiker met dit e-mailadres'));
  } else {
    next(err);
  }
});

// delete action when a user gets deleted
userSchema.post('findOneAndDelete', async function (user) {
  if (user) {
    const patients = await Patient.find({ eigenaar: user._id });
    for (let patient of patients) {
      await Bloodpressure.deleteMany({
        patient: patient._id,
      });
    }
    await Patient.deleteMany({ eigenaar: user._id });
  }
});

module.exports = mongoose.model('User', userSchema);
