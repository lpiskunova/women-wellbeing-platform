const { sequelize } = require('../config/database');

class HealthService {
  static async getHealth() {
    const result = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      db: 'unknown',
    };

    try {
      await sequelize.query('SELECT 1');
      result.db = 'up';
    } catch (err) {
      result.db = 'down';
      result.status = 'degraded';
      result.error = err.message;
    }

    return result;
  }
}

module.exports = HealthService;
