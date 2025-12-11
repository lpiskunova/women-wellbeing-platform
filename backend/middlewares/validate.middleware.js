const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');

/**
 * validate(schema, 'body' | 'query' | 'params')
 * uses the Joi schema and, if validation fails,
 * throws ApiError.badRequest with an array of messages.
 */
function validate(schema, property = 'body') {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      logger.warn('Validation error: %o', error.details);
      return next(
        ApiError.badRequest(
          'Validation failed',
          error.details.map((d) => d.message)
        )
      );
    }

    req[property] = value;
    next();
  };
}

module.exports = validate;
