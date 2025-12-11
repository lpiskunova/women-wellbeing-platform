require('dotenv').config();
const request = require('supertest');
const app = require('../app');

describe('Compare API', () => {
    it('GET /api/compare compares several countries by indicator and year', async () => {
      const res = await request(app)
        .get('/api/compare')
        .query({
          indicatorCode: 'WBL_INDEX',
          year: 2023,
          locations: 'FRA,AFG',
        });
  
      expect(res.statusCode).toBe(200);

      expect(res.body).toHaveProperty('indicator');
      expect(res.body.indicator).toHaveProperty('code', 'WBL_INDEX');
      expect(res.body.indicator).toHaveProperty('year', 2023);
      expect(res.body.indicator).toHaveProperty('unit');
      expect(res.body.indicator.unit).toHaveProperty('code');
      expect(res.body.indicator.unit).toHaveProperty('name');

      expect(res.body).toHaveProperty('items');
      expect(Array.isArray(res.body.items)).toBe(true);
  
      if (res.body.items.length > 0) {
        const first = res.body.items[0];
        expect(first).toHaveProperty('value');
        expect(first).toHaveProperty('year');
        expect(first).toHaveProperty('rank');
        expect(first).toHaveProperty('location');
        expect(first.location).toHaveProperty('iso3');
        expect(first.location).toHaveProperty('name');
        expect(first.location).toHaveProperty('region');
      }
    });
  
    it('returns 400 if year is not a number', async () => {
      const res = await request(app)
        .get('/api/compare')
        .query({
          indicatorCode: 'WBL_INDEX',
          year: 'not-a-number',
          locations: 'FRA,AFG',
        });
  
      expect(res.statusCode).toBe(400);
    });
});  



// require('dotenv').config();
// const request = require('supertest');
// const app = require('../app');

// jest.setTimeout(30000);

// describe('Compare API', () => {
//   it('GET /api/compare compares several countries by indicator and year', async () => {
//     const year = 2023;

//     const res = await request(app).get(
//       `/api/compare?indicatorCode=WBL_INDEX&year=${year}&locations=FRA,AFG`
//     );

//     expect(res.statusCode).toBe(200);

//     expect(res.body).toHaveProperty('indicator');
//     expect(res.body.indicator).toHaveProperty('code', 'WBL_INDEX');
//     expect(res.body.indicator).toHaveProperty('year', year);
//     expect(res.body).toHaveProperty('items');
//     expect(Array.isArray(res.body.items)).toBe(true);
//     expect(res.body.items.length).toBeGreaterThan(0);

//     const countries = res.body.items.map((i) => i.location.iso3);
//     expect(countries).toContain('FRA');
//     expect(countries).toContain('AFG');
//   });
// });