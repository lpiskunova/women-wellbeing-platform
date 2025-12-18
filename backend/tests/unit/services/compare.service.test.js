jest.mock('../../../config/database', () => ({
    sequelize: {
      query: jest.fn(),
    },
}));
  
const { sequelize } = require('../../../config/database');
const CompareService = require('../../../services/compare.service');
const ApiError = require('../../../utils/ApiError');
  
describe('CompareService (unit)', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('Throws 400 if the location list is empty or not an array', async () => {
        await expect(
            CompareService.compareLocations({
                indicatorCode: 'WBL_INDEX',
                year: 2023,
                locationIso3List: [],
            })
        ).rejects.toMatchObject({
            statusCode: 400,
            message: 'locations list is required',
        });
    
        await expect(
            CompareService.compareLocations({
                indicatorCode: 'WBL_INDEX',
                year: 2023,
                locationIso3List: null,
            })
        ).rejects.toMatchObject({
            statusCode: 400,
            message: 'locations list is required',
        });
    });
  
    it('throws 400 for incorrect ISO3 codes', async () => {
        await expect(
            CompareService.compareLocations({
                indicatorCode: 'WBL_INDEX',
                year: 2023,
                locationIso3List: ['FRA', '??'],
            })
        ).rejects.toMatchObject({
            statusCode: 400,
            message: 'Invalid location ISO3 codes',
        });
    });
  
    it('throws 404 if the indicator is not found', async () => {
        sequelize.query.mockResolvedValue([]);
    
        await expect(
            CompareService.compareLocations({
                indicatorCode: 'UNKNOWN',
                year: 2023,
                locationIso3List: ['FRA', 'AFG'],
            })
        ).rejects.toBeInstanceOf(ApiError);
    
        await expect(
            CompareService.compareLocations({
                indicatorCode: 'UNKNOWN',
                year: 2023,
                locationIso3List: ['FRA', 'AFG'],
            })
        ).rejects.toMatchObject({
            statusCode: 404,
            message: 'Indicator not found',
        });
    });
  
    it('returns the correct comparison object on success', async () => {
        const indicatorRow = {
            code: 'WBL_INDEX',
            name: 'Index',
            higher_is_better: true,
            unit_code: 'INDEX100',
            unit_name: 'Index',
            symbol: null,
        };
    
        const rows = [
            {
                id: 1,
                year: 2023,
                value: 96.9,
                note: null,
                location_iso3: 'FRA',
                location_name: 'France',
                unit_code: 'INDEX100',
                data_source_code: 'WBL_PANEL',
                gender_code: null,
                age_group_code: null,
                observation_status_code: null,
                region: 'Europe',
                income_group: 'High income',
            },
            {
                id: 2,
                year: 2023,
                value: 26.3,
                note: null,
                location_iso3: 'AFG',
                location_name: 'Afghanistan',
                unit_code: 'INDEX100',
                data_source_code: 'WBL_PANEL',
                gender_code: null,
                age_group_code: null,
                observation_status_code: null,
                region: 'South Asia',
                income_group: 'Low income',
            },
        ];
    
        sequelize.query
            .mockResolvedValueOnce([indicatorRow])
            .mockResolvedValueOnce(rows);
    
        const result = await CompareService.compareLocations({
            indicatorCode: 'WBL_INDEX',
            year: 2023,
            locationIso3List: ['FRA', 'AFG'],
        });
    
        expect(result.indicator).toEqual({
            code: 'WBL_INDEX',
            name: 'Index',
            year: 2023,
            higher_is_better: true,
            unit: {
            code: 'INDEX100',
            name: 'Index',
            symbol: null,
            },
        });
    
        expect(result.items).toHaveLength(2);
        expect(result.items[0].rank).toBe(1);
        expect(result.items[0].location.iso3).toBe('FRA');
    
        const [sql2] = sequelize.query.mock.calls[1];
        expect(sql2).toContain('ORDER BY');
        expect(sql2).toContain('o.value DESC');
    });
});
  