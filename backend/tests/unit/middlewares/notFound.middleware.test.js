const notFound = require('../../../middlewares/notFound.middleware');
const ApiError = require('../../../utils/ApiError');

describe('notFound middleware (unit)', () => {
    it('calls next(ApiError.notFound) with the correct message', () => {
        const req = { originalUrl: '/api/unknown' };
        const res = {};
        const next = jest.fn();

        notFound(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        const err = next.mock.calls[0][0];

        expect(err).toBeInstanceOf(ApiError);
        expect(err.statusCode).toBe(404);
        expect(err.message).toBe('Route /api/unknown not found');
    });
});
