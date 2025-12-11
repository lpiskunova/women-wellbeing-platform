const Redis = require('ioredis');
const logger = require('./logger');

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = Number(process.env.REDIS_PORT) || 6379;

const redis = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT,
});

redis.on('connect', () => {
  logger.info('Redis connection established', {
    host: REDIS_HOST,
    port: REDIS_PORT,
  });
});

redis.on('error', (err) => {
  logger.error('Redis connection error', {
    error: err.message,
  });
});

module.exports = redis;
