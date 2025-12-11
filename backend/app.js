const express = require('express');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const cors = require('cors');

const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');

const logger = require('./config/logger');
const routes = require('./routes');
const notFound = require('./middlewares/notFound.middleware');
const errorHandler = require('./middlewares/error.middleware');
const requestLogger = require('./middlewares/requestLogger.middleware');

const app = express();

Sentry.init({
  dsn: process.env.SENTRY_DSN || undefined,
  environment: process.env.NODE_ENV || 'development',
  tracesSampleRate: 0.1,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// Enabling CORS for the frontend
app.use(cors());

// Parsing JSON
app.use(express.json());

app.use(requestLogger);

if (process.env.NODE_ENV !== 'production') {
  app.use(
    morgan('combined', {
      stream: logger.stream,
    })
  );
}

// Swagger (OpenAPI documentation)
const swaggerPath = path.join(__dirname, 'docs/openapi.yaml');
const swaggerDoc = YAML.load(swaggerPath);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// Main API routes
app.use('/api', routes);

// 404 and global error handling
app.use(notFound);

app.use(Sentry.Handlers.errorHandler());
app.use(errorHandler);

module.exports = app;