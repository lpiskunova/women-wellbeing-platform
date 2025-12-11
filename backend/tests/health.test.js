require('dotenv').config();
const request = require('supertest');
const app = require('../app');

jest.setTimeout(30000);

describe('System: /health', () => {
  it('GET /api/health returns ok and the database status', async () => {
    const res = await request(app).get('/api/health');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('timestamp');
    expect(res.body).toHaveProperty('db');
  });
});