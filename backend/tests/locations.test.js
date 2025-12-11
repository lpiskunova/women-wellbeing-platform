require('dotenv').config();
const request = require('supertest');
const app = require('../app');

jest.setTimeout(30000);

describe('Locations API', () => {
  it('GET /api/locations returns a list with total and items', async () => {
    const res = await request(app).get('/api/locations?limit=5&offset=0');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('total');
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.items.length).toBeGreaterThan(0);
    const first = res.body.items[0];
    expect(first).toHaveProperty('id');
    expect(first).toHaveProperty('name');
  });

  it('GET /api/locations/FRA returns a specific country (FRA)', async () => {
    const res = await request(app).get('/api/locations/FRA');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('iso3', 'FRA');
    expect(res.body).toHaveProperty('name');
  });

  it('GET /api/locations supports search by q and region filter', async () => {
    const res = await request(app)
      .get('/api/locations')
      .query({
        q: 'fra', // совпадёт и с FRA, и с France
        region: 'Europe & Central Asia', // одно из значений в таблице
        limit: 50,
        offset: 0,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('items');
    expect(Array.isArray(res.body.items)).toBe(true);

    if (res.body.items.length > 0) {
      for (const loc of res.body.items) {
        expect(loc).toHaveProperty('region');
        expect(loc.region).toBe('Europe & Central Asia');
      }
    }
  });

  it('GET /api/locations/:iso3 returns 404 for unknown location', async () => {
    const res = await request(app).get('/api/locations/XXX');

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toHaveProperty('message', 'Location not found');
  });
});
