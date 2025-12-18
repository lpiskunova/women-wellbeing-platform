jest.mock('../../../config/database', () => ({
    sequelize: {
      query: jest.fn(),
    },
}));
  
const { sequelize } = require('../../../config/database');
const IndicatorService = require('../../../services/indicators.service');
const ApiError = require('../../../utils/ApiError');
  
describe('IndicatorService (unit)', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('listIndicators takes q and domainCode into account in replacements', async () => {
        const fakeItems = [
            {
                id: 1,
                code: 'WBL_INDEX',
                name: 'Index',
                description: null,
                higher_is_better: true,
                domain_code: 'LAW_INST',
                domain_name: 'Law and institutions',
                unit_code: 'INDEX100',
                unit_name: 'Index',
                symbol: null,
                source_code: 'WBL_PANEL',
                source_name: 'WBL',
                source_url: 'https://example.com',
                latest_year: 2023,
                coverage_count: 3,
            },
        ];
        const fakeCountRow = { total: 1 };
    
        sequelize.query
            .mockResolvedValueOnce(fakeItems)
            .mockResolvedValueOnce([fakeCountRow]);
    
        const result = await IndicatorService.listIndicators({
            q: null,
            domainCode: null,
            limit: 10,
            offset: 0,
        });
    
        expect(result).toEqual({
            total: 1,
            items: fakeItems,
        });
    
        expect(sequelize.query).toHaveBeenCalledTimes(2);
    
        const [, options1] = sequelize.query.mock.calls[0];
        expect(options1.replacements).toEqual({ limit: 10, offset: 0 });
    });
  
    it('listIndicators takes q and domainCode into account in replacements', async () => {
        sequelize.query
            .mockResolvedValueOnce([])
            .mockResolvedValueOnce([{ total: 0 }]);
    
        await IndicatorService.listIndicators({
            q: 'WBL',
            domainCode: 'LAW_INST',
            limit: 50,
            offset: 5,
        });
    
        const [, options] = sequelize.query.mock.calls[0];
        expect(options.replacements).toEqual({
            limit: 50,
            offset: 5,
            q: '%WBL%',
            domainCode: 'LAW_INST',
        });
    });
  
    it('getByCode returns one indicator on success', async () => {
        const row = {
            id: 1,
            code: 'WBL_INDEX',
            name: 'Index',
            description: null,
            higher_is_better: true,
            domain_code: 'LAW_INST',
            domain_name: 'Law and institutions',
            unit_code: 'INDEX100',
            unit_name: 'Index',
            symbol: null,
            source_code: 'WBL_PANEL',
            source_name: 'WBL',
            source_url: 'https://example.com',
        };
    
        sequelize.query.mockResolvedValueOnce([row]);
    
        const result = await IndicatorService.getByCode('WBL_INDEX');
    
        expect(sequelize.query).toHaveBeenCalledTimes(1);
        expect(result).toEqual(row);
    });
  
    it('getByCode returns 404 if the indicator is not found.', async () => {
        sequelize.query.mockResolvedValue([]);
    
        await expect(
            IndicatorService.getByCode('UNKNOWN_CODE')
        ).rejects.toBeInstanceOf(ApiError);
    
        await expect(
            IndicatorService.getByCode('UNKNOWN_CODE')
        ).rejects.toMatchObject({
            statusCode: 404,
            message: 'Indicator not found',
        });
    });    
});
  