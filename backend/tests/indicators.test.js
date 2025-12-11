require('dotenv').config();
const request = require('supertest');
const app = require('../app');

describe('Indicators API', () => {
  it('GET /api/indicators returns a list with nested fields', async () => {
    const res = await request(app).get('/api/indicators?limit=5&offset=0');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('items');
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.items.length).toBeGreaterThan(0);

    const indicator = res.body.items[0];

    expect(indicator).toHaveProperty('code');
    expect(indicator).toHaveProperty('name');

    expect(indicator).toHaveProperty('domain');
    expect(indicator.domain).toHaveProperty('code');
    expect(indicator.domain).toHaveProperty('name');

    expect(indicator).toHaveProperty('unit');
    expect(indicator.unit).toHaveProperty('code');
    expect(indicator.unit).toHaveProperty('name');
    expect(indicator.unit).toHaveProperty('symbol');

    expect(indicator).toHaveProperty('source');
    expect(indicator.source).toHaveProperty('code');
    expect(indicator.source).toHaveProperty('name');
    expect(indicator.source).toHaveProperty('url');
  });

  it('GET /api/indicators/WBL_INDEX returns indicator details in nested shape', async () => {
    const res = await request(app).get('/api/indicators/WBL_INDEX');

    expect(res.statusCode).toBe(200);

    expect(res.body).toHaveProperty('code', 'WBL_INDEX');
    expect(res.body).toHaveProperty('name');

    expect(res.body).toHaveProperty('domain');
    expect(res.body.domain).toHaveProperty('code');
    expect(res.body.domain).toHaveProperty('name');

    expect(res.body).toHaveProperty('unit');
    expect(res.body.unit).toHaveProperty('code');
    expect(res.body.unit).toHaveProperty('name');
    expect(res.body.unit).toHaveProperty('symbol');

    expect(res.body).toHaveProperty('source');
    expect(res.body.source).toHaveProperty('code');
    expect(res.body.source).toHaveProperty('name');
    expect(res.body.source).toHaveProperty('url');
  });

  it('GET /api/indicators supports search by q and domain filter', async () => {
    const res = await request(app)
      .get('/api/indicators')
      .query({
        q: 'WBL',
        domain: 'LAW_INST', // домен для WBL_* индикаторов
        limit: 50,
        offset: 0,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('items');
    expect(Array.isArray(res.body.items)).toBe(true);

    if (res.body.items.length > 0) {
      for (const item of res.body.items) {
        expect(item).toHaveProperty('domain');
        expect(item.domain).toHaveProperty('code', 'LAW_INST');

        const text = `${item.code} ${item.name}`.toUpperCase();
        expect(text).toContain('WBL');
      }
    }
  });

  it('GET /api/indicators/:code returns 404 for unknown indicator', async () => {
    const res = await request(app).get(
      '/api/indicators/NON_EXISTENT_INDICATOR_CODE'
    );

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toHaveProperty('message', 'Indicator not found');
  });
});
