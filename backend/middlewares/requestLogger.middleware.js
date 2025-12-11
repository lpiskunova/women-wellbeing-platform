const { randomUUID } = require('crypto');
const logger = require('../config/logger');

function requestLogger(req, res, next) {
  const requestId = randomUUID();

  req.requestId = requestId;
  res.locals.requestId = requestId;

  const startTime = process.hrtime.bigint();

  logger.info('request_start', {
    type: 'request_start',
    requestId,
    method: req.method,
    path: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('user-agent') || null,
    query: req.query,
  });

  res.on('finish', () => {
    const durationNs = process.hrtime.bigint() - startTime;
    const durationMs = Number(durationNs) / 1e6;

    logger.info('request_end', {
      type: 'request_end',
      requestId,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Math.round(durationMs),
      contentLength: res.get('content-length') || null,
    });
  });

  next();
}

module.exports = requestLogger;
