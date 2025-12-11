require('dotenv').config();
const request = require('supertest');
const app = require('../app');

jest.setTimeout(30000);

describe('Not Found & error middleware', () => {
  it('GET /api/__does_not_exist__ returns 404 and JSON with the error', async () => {
    const res = await request(app).get('/api/__does_not_exist__');

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toHaveProperty('message');
  });
});