require('dotenv').config();   

const { Sequelize } = require('sequelize');
const logger = require('./logger');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging:
      process.env.DB_LOG_SQL === 'true'
        ? (msg) => logger.debug(msg, { type: 'sql' })
        : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

async function testConnection() {
  try {
    logger.info('Trying to connect to PostgreSQL', {
      type: 'db_connect_attempt',
      host: process.env.DB_HOST,
      dbName: process.env.DB_NAME,
    });

    await sequelize.authenticate();

    logger.info('Connected to PostgreSQL (women_wellbeing)', {
      type: 'db_connect_success',
      host: process.env.DB_HOST,
      dbName: process.env.DB_NAME,
    });
  } catch (err) {
    logger.error('Unable to connect to DB', {
      type: 'db_connect_error',
      host: process.env.DB_HOST,
      dbName: process.env.DB_NAME,
      error: err,
    });
  }
}

module.exports = {
  sequelize,
  testConnection,
};
