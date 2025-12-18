jest.mock('../../../config/logger', () => ({
    info: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
}));
  
const logger = require('../../../config/logger');
const { sequelize, testConnection } = require('../../../config/database');
  
describe('config/database testConnection (unit)', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
  
    it('logs attempt and success when authenticate resolves', async () => {
        sequelize.authenticate = jest.fn().mockResolvedValue(undefined);
    
        await testConnection();
    
        expect(sequelize.authenticate).toHaveBeenCalledTimes(1);

        expect(logger.info).toHaveBeenCalledWith(
            'Trying to connect to PostgreSQL',
            expect.objectContaining({
                type: 'db_connect_attempt',
                host: process.env.DB_HOST,
                dbName: process.env.DB_NAME,
            })
        );

        expect(logger.info).toHaveBeenCalledWith(
            'Connected to PostgreSQL (women_wellbeing)',
            expect.objectContaining({
                type: 'db_connect_success',
                host: process.env.DB_HOST,
                dbName: process.env.DB_NAME,
            })
        );

        expect(logger.error).not.toHaveBeenCalled();
    });
  
    it('logs error when authenticate rejects', async () => {
        const error = new Error('connection failed');
    
        sequelize.authenticate = jest.fn().mockRejectedValue(error);
    
        await testConnection();
    
        expect(sequelize.authenticate).toHaveBeenCalledTimes(1);
    
        expect(logger.error).toHaveBeenCalledWith(
            'Unable to connect to DB',
            expect.objectContaining({
                type: 'db_connect_error',
                host: process.env.DB_HOST,
                dbName: process.env.DB_NAME,
                error,
            })
        );
    });
});