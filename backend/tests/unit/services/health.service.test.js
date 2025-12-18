jest.mock('../../../config/database', () => ({
    sequelize: {
      query: jest.fn(),
    },
}));
  
const { sequelize } = require('../../../config/database');
const HealthService = require('../../../services/health.service');
  
describe('HealthService.getHealth (unit)', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('returns status=ok and db=up on successful request', async () => {
        sequelize.query.mockResolvedValueOnce([[{ one: 1 }]]);
    
        const result = await HealthService.getHealth();
    
        expect(sequelize.query).toHaveBeenCalledWith('SELECT 1');
        expect(result.status).toBe('ok');
        expect(result.db).toBe('up');
        expect(typeof result.timestamp).toBe('string');
        expect(new Date(result.timestamp).toString()).not.toBe('Invalid Date');
        expect(result).not.toHaveProperty('error');
    });
  
    it('returns status=degraded and db=down on DB error', async () => {
        sequelize.query.mockRejectedValueOnce(new Error('connection error'));
    
        const result = await HealthService.getHealth();
    
        expect(sequelize.query).toHaveBeenCalledWith('SELECT 1');
        expect(result.status).toBe('degraded');
        expect(result.db).toBe('down');
        expect(result.error).toBe('connection error');
    });
});