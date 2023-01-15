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

module.exports.bloodpressureSchema = Joi.object({
  bloodpressure: Joi.object({
    bovendruk: Joi.number().min(30).max(299).required(),
    onderdruk: Joi.number().min(30).max(299).required(),
    hartslag: Joi.number().allow(null, '').max(299).messages({
      'number.base': `Hartslag moet een nummer zijn.`,
    }), //
    dag: Joi.string(),
    maand: Joi.string(),
    jaar: Joi.string(),
    uur: Joi.string(),
    min: Joi.string(),
  }).required(),
});
