const mongoose = require('mongoose');
const { Schema } = mongoose;
const Person = require('./person');
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
  personen: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Person',
    },
  ],
  rollen: {
    type: [String],
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
  populateFields: 'personen',
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

module.exports = mongoose.model('User', userSchema);
