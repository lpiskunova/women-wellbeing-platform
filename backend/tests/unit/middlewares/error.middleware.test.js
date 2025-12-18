jest.mock('../../../config/logger', () => ({
    error: jest.fn(),
    warn: jest.fn(),
}));
  
const logger = require('../../../config/logger');
const errorHandler = require('../../../middlewares/error.middleware');
const ApiError = require('../../../utils/ApiError');
  
describe('errorHandler middleware (unit)', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
  
    it('logs the handled error and returns 400 for ApiError.badRequest', () => {
        const err = ApiError.badRequest('Validation failed', ['field is required']);
    
        const req = {
            method: 'GET',
            originalUrl: '/api/test',
            requestId: 'req-123',
        };
    
        const res = {
            statusCode: 200,
            status: jest.fn(function (code) {
                this.statusCode = code;
                return this;
            }),
            json: jest.fn(),
        };
    
        const next = jest.fn();
    
        errorHandler(err, req, res, next);
    
        expect(logger.warn).toHaveBeenCalledWith('Handled error', expect.objectContaining({
            requestId: 'req-123',
            method: 'GET',
            path: '/api/test',
            statusCode: 400,
            errorMessage: 'Validation failed',
            details: ['field is required'],
            type: 'error_handled',
        }));
    
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: {
                message: 'Validation failed',
                details: ['field is required'],
                requestId: 'req-123',
            },
        });
    
        expect(next).not.toHaveBeenCalled();
    });
  
    it('logs unhandled error and returns 500 for normal error', () => {
        const err = new Error('Something went wrong');
    
        const req = {
            method: 'POST',
            originalUrl: '/api/other',
            requestId: 'req-999',
        };
    
        const res = {
            statusCode: 200,
            status: jest.fn(function (code) {
                this.statusCode = code;
                return this;
            }),
            json: jest.fn(),
        };
    
        const next = jest.fn();
    
        errorHandler(err, req, res, next);
    
        expect(logger.error).toHaveBeenCalledWith('Unhandled error', expect.objectContaining({
            requestId: 'req-999',
            method: 'POST',
            path: '/api/other',
            statusCode: 500,
            errorMessage: 'Something went wrong',
            type: 'error_unhandled',
        }));
    
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: {
                message: 'Something went wrong',
                details: null,
                requestId: 'req-999',
            },
        });
        expect(next).not.toHaveBeenCalled();
    });
});
  