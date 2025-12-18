const ApiErrorImport = require('../../../utils/ApiError');
const ApiError = ApiErrorImport.ApiError || ApiErrorImport;

describe('utils/ApiError', () => {
    test('constructs an ApiError with statusCode/message/details', () => {
        const err = new ApiError(418, 'I am a teapot', ['d1', 'd2']);
        expect(err).toBeInstanceOf(Error);
        expect(err.statusCode).toBe(418);
        expect(err.message).toBe('I am a teapot');
        expect(err.details).toEqual(['d1', 'd2']);
    });

    test('badRequest() factory sets status 400', () => {
        expect(typeof ApiError.badRequest).toBe('function');
        const err = ApiError.badRequest('Validation failed', ['limit must be number']);
        expect(err.statusCode).toBe(400);
        expect(err.message).toBe('Validation failed');
        expect(Array.isArray(err.details)).toBe(true);
    });

    test('notFound() factory sets status 404', () => {
        expect(typeof ApiError.notFound).toBe('function');
        const err = ApiError.notFound('Route /api/x not found');
        expect(err.statusCode).toBe(404);
        expect(err.message).toMatch(/not found/i);
    });

    test('forbidden() uses status 403 and default message', () => {
        const err = ApiError.forbidden();
        expect(err.statusCode).toBe(403);
        expect(err.message).toBe('Forbidden');
        expect(err.details).toBeNull();
    });
    
    test('unauthorized() uses status 401 and allows custom message', () => {
        const err = ApiError.unauthorized('No auth token');
        expect(err.statusCode).toBe(401);
        expect(err.message).toBe('No auth token');
        expect(err.details).toBeNull();
    });
    
    test('internal() uses status 500, default message and details if provided', () => {
        const errDefault = ApiError.internal();
        expect(errDefault.statusCode).toBe(500);
        expect(errDefault.message).toBe('Internal server error');
    
        const errWithDetails = ApiError.internal('Boom', { traceId: 'abc-123' });
        expect(errWithDetails.statusCode).toBe(500);
        expect(errWithDetails.message).toBe('Boom');
        expect(errWithDetails.details).toEqual({ traceId: 'abc-123' });
    });
});