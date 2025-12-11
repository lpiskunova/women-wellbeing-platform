const redis = require('../config/redis');
const logger = require('../config/logger');

/**
 * Caches JSON responses for GET requests for the specified time (ttlSeconds).
 */
function cache(ttlSeconds) {
  return async (req, res, next) => {
    if (req.method !== 'GET') {
      return next();
    }

    const key = `cache:${req.method}:${req.originalUrl}`;

    try {
      const cached = await redis.get(key);
      if (cached) {
        logger.debug('Cache hit', { key });

        const data = JSON.parse(cached);
        return res.status(200).json(data);
      }

      logger.debug('Cache miss', { key });

      const originalJson = res.json.bind(res);

      res.json = async (body) => {
        try {
          if (res.statusCode < 400) {
            await redis.set(key, JSON.stringify(body), 'EX', ttlSeconds);
            logger.debug('Cached response', { key, ttlSeconds });
          }
        } catch (err) {
          logger.error('Failed to write to cache', {
            key,
            error: err.message,
          });
        }

        return originalJson(body);
      };

      return next();
    } catch (err) {
      logger.error('Cache middleware error', {
        key,
        error: err.message,
      });
      return next();
    }
  };
}

module.exports = cache;
