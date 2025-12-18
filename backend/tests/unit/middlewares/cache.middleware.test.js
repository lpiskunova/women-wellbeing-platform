jest.mock('../../../config/redis', () => ({
    get: jest.fn(),
    set: jest.fn(),
}));
  
jest.mock('../../../config/logger', () => ({
    debug: jest.fn(),
    error: jest.fn(),
}));
  
const redis = require('../../../config/redis');
const logger = require('../../../config/logger');
const cache = require('../../../middlewares/cache.middleware');
  
describe('cache middleware (unit)', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('Skips non-GET requests and simply calls next()', async () => {
        const req = { method: 'POST', originalUrl: '/api/locations' };
        const res = {};
        const next = jest.fn();
    
        const mw = cache(60);
        await mw(req, res, next);
    
        expect(next).toHaveBeenCalledTimes(1);
        expect(redis.get).not.toHaveBeenCalled();
        expect(redis.set).not.toHaveBeenCalled();
    });
  
    it('Returns the response from the cache on a cache hit', async () => {
        const key = 'cache:GET:/api/locations?limit=5';
        const cachedBody = { total: 1, items: [{ id: 1 }] };
    
        redis.get.mockResolvedValueOnce(JSON.stringify(cachedBody));
    
        const req = { method: 'GET', originalUrl: '/api/locations?limit=5' };
        const res = {
            statusCode: 200,
            status: jest.fn(function (code) {
                this.statusCode = code;
                return this;
            }),
            json: jest.fn(function (body) {
                return body;
            }),
        };
        const next = jest.fn();
    
        const mw = cache(60);
        await mw(req, res, next);
    
        expect(redis.get).toHaveBeenCalledWith(key);
        expect(logger.debug).toHaveBeenCalledWith('Cache hit', { key });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(cachedBody);
        expect(next).not.toHaveBeenCalled();
    });
  
    it('Writes to the cache in case of cache miss and successful response', async () => {
        const key = 'cache:GET:/api/locations?limit=5';
        redis.get.mockResolvedValueOnce(null);
        redis.set.mockResolvedValueOnce('OK');
    
        const req = { method: 'GET', originalUrl: '/api/locations?limit=5' };
    
        const originalJson = jest.fn(function (body) {
            return body;
        });
    
        const res = {
            statusCode: 200,
            json: originalJson,
        };
    
        const next = jest.fn(async () => {
            await res.json({ total: 123 });
        });
    
        const mw = cache(60);
        await mw(req, res, next);
    
        expect(redis.get).toHaveBeenCalledWith(key);
        expect(next).toHaveBeenCalled();
    
        expect(redis.set).toHaveBeenCalledWith(
            key,
            JSON.stringify({ total: 123 }),
            'EX',
            60
        );
    
        expect(originalJson).toHaveBeenCalledWith({ total: 123 });
        expect(logger.debug).toHaveBeenCalledWith('Cached response', {
            key,
            ttlSeconds: 60,
        });
    });
  
    it('при ошибке Redis.get логирует и вызывает next()', async () => {
        const error = new Error('Redis is down');
        redis.get.mockRejectedValueOnce(error);
    
        const req = { method: 'GET', originalUrl: '/api/locations?limit=5' };
        const res = {
            statusCode: 200,
            json: jest.fn(),
        };
        const next = jest.fn();
    
        const mw = cache(60);
        await mw(req, res, next);
    
        expect(logger.error).toHaveBeenCalledWith(
            'Cache middleware error',
            expect.objectContaining({
                key: 'cache:GET:/api/locations?limit=5',
                error: error.message,
            })
        );
        expect(next).toHaveBeenCalled();
    });
});