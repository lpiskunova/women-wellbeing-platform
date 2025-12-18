jest.mock('../../../config/logger', () => ({
    warn: jest.fn(),
}));
  
const Joi = require('joi');
const validate = require('../../../middlewares/validate.middleware');
const ApiError = require('../../../utils/ApiError');
const logger = require('../../../config/logger');
  
describe('validate middleware (unit)', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
  
    const schema = Joi.object({
        name: Joi.string().required(),
        age: Joi.number().integer().min(0).required(),
    });
  
    it('skips valid data and removes unnecessary fields', () => {
        const req = {
            body: {
                name: 'Alice',
                age: 30,
                extra: 'should-be-stripped',
            },
        };
        const res = {};
        const next = jest.fn();
    
        const mw = validate(schema, 'body');
        mw(req, res, next);
    
        expect(next).toHaveBeenCalledWith();
        expect(req.body).toEqual({ name: 'Alice', age: 30 });
        expect(logger.warn).not.toHaveBeenCalled();
    });
  
    it('calls next(ApiError.badRequest) on validation error', () => {
        const req = {
            body: {
                age: -5,
            },
        };
        const res = {};
        const next = jest.fn();
    
        const mw = validate(schema, 'body');
        mw(req, res, next);
    
        expect(next).toHaveBeenCalledTimes(1);
        const err = next.mock.calls[0][0];
    
        expect(err).toBeInstanceOf(ApiError);
        expect(err.statusCode).toBe(400);
        expect(err.message).toBe('Validation failed');
    
        expect(err.details).toEqual(
            expect.arrayContaining([
                expect.stringContaining('"name" is required'),
                expect.stringContaining('"age" must be greater than or equal to 0'),
            ])
        );
    
        expect(logger.warn).toHaveBeenCalled();
    });
});
  