require('dotenv').config();
const request = require('supertest');
const app = require('../../app');

describe('Observations API', () => {
  it('GET /api/observations returns time series (items may be empty)', async () => {
    const res = await request(app).get(
      '/api/observations?indicatorCode=WBL_INDEX&locationIso3=FRA'
    );

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('items');
    expect(Array.isArray(res.body.items)).toBe(true);

    if (res.body.items.length > 0) {
      const obs = res.body.items[0];
      expect(obs).toHaveProperty('year');
      expect(obs).toHaveProperty('value');
    }
  });

  it('GET /api/observations requires indicatorCode and locationIso3', async () => {
    const res = await request(app).get('/api/observations');

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toHaveProperty(
      'message',
      'indicatorCode and locationIso3 are required'
    );
  });

  it('GET /api/observations validates yearFrom', async () => {
    const res = await request(app).get(
      '/api/observations?indicatorCode=WBL_INDEX&locationIso3=FRA&yearFrom=not-a-year'
    );

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toHaveProperty(
      'message',
      'yearFrom must be a number'
    );
  });

  it('GET /api/observations validates yearTo', async () => {
    const res = await request(app).get(
      '/api/observations?indicatorCode=WBL_INDEX&locationIso3=FRA&yearTo=oops'
    );

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toHaveProperty(
      'message',
      'yearTo must be a number'
    );
  });

  it('GET /api/observations supports extra filters (gender, ageGroup)', async () => {
    const res = await request(app)
      .get('/api/observations')
      .query({
        indicatorCode: 'UNODC_FEMICIDE_COUNT',
        locationIso3: 'FRA',
        yearFrom: 2019,
        yearTo: 2021,
        gender: 'FEMALE',
        ageGroup: 'TOTAL',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('items');
    expect(Array.isArray(res.body.items)).toBe(true);

    if (res.body.items.length > 0) {
      for (const obs of res.body.items) {
        expect(obs.year).toBeGreaterThanOrEqual(2019);
        expect(obs.year).toBeLessThanOrEqual(2021);
        if (obs.gender_code) {
          expect(obs.gender_code).toBe('FEMALE');
        }
        if (obs.age_group_code) {
          expect(obs.age_group_code).toBe('TOTAL');
        }
      }
    }
  });
});
