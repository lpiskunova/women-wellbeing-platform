require('dotenv').config();
const app = require('./app');
const logger = require('./config/logger');
const { sequelize } = require('./config/database');
const Sentry = require('@sentry/node');

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established', {
      type: 'db_connect_success',
    });

    app.listen(PORT, () => {
      logger.info('HTTP server started', {
        type: 'server_start',
        port: PORT,
      });
      logger.info('Swagger UI available', {
        type: 'swagger_available',
        url: `http://localhost:${PORT}/api/docs`,
      });
    });
  } catch (err) {
    logger.error('Failed to start server', {
      type: 'server_start_error',
      error: err,
    });

    if (process.env.SENTRY_DSN) {
      Sentry.captureException(err);
    }

    process.exit(1);
  }
}

process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Promise Rejection', {
    type: 'unhandled_rejection',
    error: err,
  });

  if (process.env.SENTRY_DSN) {
    Sentry.captureException(err);
  }
});

start();
