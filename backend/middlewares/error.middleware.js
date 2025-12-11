const logger = require('../config/logger');

function errorHandler(err, req, res, _next) {
  const status = err.statusCode || 500;
  const requestId = req.requestId;

  const baseMeta = {
    requestId,
    method: req.method,
    path: req.originalUrl,
    statusCode: status,
  };

  if (status >= 500) {
    logger.error('Unhandled error', {
      ...baseMeta,
      errorMessage: err.message,
      error: err,
      details: err.details || null,
      type: 'error_unhandled',
    });
  } else {
    logger.warn('Handled error', {
      ...baseMeta,
      errorMessage: err.message,
      details: err.details || null,
      type: 'error_handled',
    });
  }

  res.status(status).json({
    error: {
      message: err.message || 'Internal server error',
      details: err.details || null,
      requestId,
    },
  });
}

module.exports = errorHandler;
