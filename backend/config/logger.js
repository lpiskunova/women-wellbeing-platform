const { createLogger, format, transports } = require('winston');

const isProd = process.env.NODE_ENV === 'production';

const transportList = [
  new transports.Console(),
];

if (process.env.LOG_TO_FILE === 'true') {
  transportList.push(
    new transports.File({
      filename: 'logs/app.log',
      maxsize: 5 * 1024 * 1024,
      maxFiles: 3,
    })
  );
}

let LokiTransport = null;

try {
  const lokiModule = require('winston-loki');

  LokiTransport =
    lokiModule.LokiTransport || lokiModule.default || lokiModule;
} catch (e) {
  LokiTransport = null;
}

if (process.env.LOKI_URL && LokiTransport) {
  transportList.push(
    new LokiTransport({
      host: process.env.LOKI_URL,
      labels: {
        app: 'women-wellbeing-backend',
        env: process.env.NODE_ENV || 'development',
      },
      json: true,
      onConnectionError: (err) => {
        console.error('Loki connection error', err.message || err);
      },
    })
  );
}

const logger = createLogger({
  level: process.env.LOG_LEVEL || (isProd ? 'info' : 'debug'),

  defaultMeta: {
    service: 'women-wellbeing-backend',
    env: process.env.NODE_ENV || 'development',
  },

  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),

  transports: transportList,
});

logger.stream = {
  write: (message) => {
    logger.info(message.trim(), { type: 'http_raw' });
  },
};

module.exports = logger;
