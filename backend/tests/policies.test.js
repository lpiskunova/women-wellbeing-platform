require('dotenv').config();
const request = require('supertest');
const app = require('../app');

describe('Policies API', () => {
  it('GET /api/policies returns a list of measures/policies', async () => {
    const res = await request(app).get('/api/policies');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('items');
    expect(Array.isArray(res.body.items)).toBe(true);

    if (res.body.items.length > 0) {
      const item = res.body.items[0];
      expect(item).toHaveProperty('year');
      expect(item).toHaveProperty('title');
      expect(item).toHaveProperty('country');
    }
  });

  it('GET /api/policies validates yearFrom and returns 400 for invalid value', async () => {
    const res = await request(app)
      .get('/api/policies')
      .query({ yearFrom: 'not-a-year' });
  
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toHaveProperty('message', 'yearFrom must be a number');
  });

  it('GET /api/policies accepts filters and parses years', async () => {
    const res = await request(app)
      .get('/api/policies')
      .query({
        locationIso3: 'DZA',
        yearFrom: 2000,
        yearTo: 2020,
        formOfViolence: 'Violence against women and girls',
        measureType: 'Laws > Violence against women > Legislation',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('items');
    expect(Array.isArray(res.body.items)).toBe(true);

    if (res.body.items.length > 0) {
      const item = res.body.items[0];
      expect(item.year).toBeGreaterThanOrEqual(2000);
      expect(item.year).toBeLessThanOrEqual(2020);
      if (item.form_of_violence) {
        expect(item.form_of_violence).toBe('Violence against women and girls');
      }
      if (item.measure_type) {
        expect(item.measure_type).toBe(
          'Laws > Violence against women > Legislation'
        );
      }
    }
  });
});
