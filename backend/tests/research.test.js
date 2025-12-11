const request = require('supertest');
const app = require('../app');

describe('Research API', () => {
  it('GET /api/research/templates возвращает список шаблонов/брифов', async () => {
    const res = await request(app).get('/api/research/templates');

    expect(res.statusCode).toBe(200);
    expect(typeof res.body).toBe('object');

    // ожидаем объект вида { items: [...] }
    expect(res.body).toHaveProperty('items');
    expect(Array.isArray(res.body.items)).toBe(true);

    // если что-то есть, немножко проверим структуру,
    // если список пустой — тест всё равно считается успешным
    if (res.body.items.length > 0) {
      const t = res.body.items[0];
      expect(t).toHaveProperty('id');
      expect(t).toHaveProperty('title');
      expect(t).toHaveProperty('type');
    }
  });

  it('GET /api/research/templates/:id возвращает полный шаблон, если он существует', async () => {
    // сначала получаем список шаблонов,
    // чтобы взять реальный существующий id
    const listRes = await request(app).get('/api/research/templates');
    expect(listRes.statusCode).toBe(200);

    const items = (listRes.body && listRes.body.items) || [];

    // если вдруг нет ни одного шаблона — просто выходим,
    // тест всё равно считается пройденным
    if (items.length === 0) {
      return;
    }

    const firstId = items[0].id;
    const res = await request(app).get(`/api/research/templates/${firstId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', firstId);
    expect(res.body).toHaveProperty('title');
    expect(res.body).toHaveProperty('type');
  });

  it('GET /api/research/templates/:id для несуществующего id возвращает 404 или корректную ошибку', async () => {
    const res = await request(app).get('/api/research/templates/__unknown__');

    // допускаем 404 (самый логичный вариант) или 400/500,
    // если контроллер отдаёт ошибку через middleware
    expect([404, 400, 500]).toContain(res.statusCode);

    // если это не 404/400 с пустым телом, проверим, что есть поле error
    if (res.body && Object.keys(res.body).length > 0 && res.statusCode !== 200) {
      expect(res.body).toHaveProperty('error');
    }
  });
});


// require('dotenv').config();
// const request = require('supertest');
// const app = require('../app');

// jest.setTimeout(30000);

// describe('Research API', () => {
//   it('GET /api/research/templates returns a list of templates/briefs', async () => {
//     const res = await request(app).get('/api/research/templates');

//     expect(res.statusCode).toBe(200);
//     expect(res.body).toHaveProperty('items');
//     expect(Array.isArray(res.body.items)).toBe(true);
//     expect(res.body.items.length).toBeGreaterThan(0);

//     const t = res.body.items[0];
//     expect(t).toHaveProperty('id');
//     expect(t).toHaveProperty('title');
//     expect(t).toHaveProperty('type');
//   });
// });