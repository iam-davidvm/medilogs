const BaseJoi = require('joi');

// prevent HTML injection
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
  type: 'string',
  base: joi.string(),
  messages: {
    'string.escapeHTML': '{{#label}} must not include HTML!',
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error('string.escapeHTML', { value });
        return clean;
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);

// NA TE LEZEN: https://softchris.github.io/pages/joi.html#introducing-joi
module.exports.bloodpressureSchema = Joi.object({
  bloodpressure: Joi.object({
    onderdruk: Joi.number().min(30).max(250).required(),
    bovendruk: Joi.number().min(30).max(250).required(),
    hartslag: Joi.number().min(30).max(250).required(),
    dag: Joi.string(),
    maand: Joi.string(),
    jaar: Joi.string(),
    uur: Joi.string(),
    min: Joi.string(),
    //tijdstip: Joi.date().required(),
    //persoon: Joi.string().required(),
  }).required(),
});
