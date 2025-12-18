jest.mock('crypto', () => ({
    randomUUID: jest.fn(() => 'test-request-id'),
}));
  
  jest.mock('../../../config/logger', () => ({
    info: jest.fn(),
}));
  
const logger = require('../../../config/logger');
const requestLogger = require('../../../middlewares/requestLogger.middleware');
  
describe('requestLogger middleware (unit)', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('assigns a requestId, logs the beginning and end of the request', () => {
        const req = {
            method: 'GET',
            originalUrl: '/api/test',
            ip: '127.0.0.1',
            query: { q: 'test' },
            get: (header) => (header === 'user-agent' ? 'test-agent' : null),
        };
    
        const res = {
            statusCode: 200,
            locals: {},
            on: jest.fn(),
            get: jest.fn(() => null),
        };
    
        const next = jest.fn();
    
        requestLogger(req, res, next);

        expect(req.requestId).toBe('test-request-id');
        expect(res.locals.requestId).toBe('test-request-id');

        expect(res.on).toHaveBeenCalledTimes(1);
        expect(res.on.mock.calls[0][0]).toBe('finish');
        const finishHandler = res.on.mock.calls[0][1];

        expect(logger.info).toHaveBeenCalledWith('request_start', expect.objectContaining({
            type: 'request_start',
            requestId: 'test-request-id',
            method: 'GET',
            path: '/api/test',
            ip: '127.0.0.1',
            userAgent: 'test-agent',
            query: { q: 'test' },
        }));

        finishHandler();

        expect(logger.info).toHaveBeenCalledWith('request_end', expect.objectContaining({
            type: 'request_end',
            requestId: 'test-request-id',
            method: 'GET',
            path: '/api/test',
            statusCode: 200,
        }));
    
        expect(next).toHaveBeenCalledTimes(1);
    });
});
  