jest.mock('../../../config/database', () => ({
    sequelize: {
      query: jest.fn(),
    },
}));
  
const { sequelize } = require('../../../config/database');
const ObservationService = require('../../../services/observations.service');
const ApiError = require('../../../utils/ApiError');
  
describe('ObservationService (unit)', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    describe('getObservations', () => {
        it('returns indicator and items on successful request', async () => {
            const indicatorRow = {
                code: 'WBL_INDEX',
                name: 'Index',
                description: 'desc',
                higher_is_better: true,
                domain_code: 'LAW_INST',
                domain_name: 'Law',
                unit_code: 'INDEX100',
                unit_name: 'Index',
                symbol: null,
            };
    
            const itemsRows = [
                {
                    id: 1,
                    year: 2020,
                    value: 90.0,
                    note: null,
                    location_iso3: 'FRA',
                    location_name: 'France',
                    unit_code: 'INDEX100',
                    data_source_code: 'WBL_PANEL',
                    gender_code: null,
                    age_group_code: null,
                    observation_status_code: 'OFFICIAL',
                },
            ];
    
            sequelize.query
                .mockResolvedValueOnce([indicatorRow])
                .mockResolvedValueOnce(itemsRows);
    
            const result = await ObservationService.getObservations({
                indicatorCode: 'WBL_INDEX',
                locationIso3: 'FRA',
                yearFrom: 2010,
                yearTo: 2020,
                genderCode: 'FEMALE',
            });
    
            expect(result.indicator.code).toBe('WBL_INDEX');
            expect(result.indicator.domain).toEqual({
                code: 'LAW_INST',
                name: 'Law',
            });
            expect(result.indicator.unit).toEqual({
                code: 'INDEX100',
                name: 'Index',
                symbol: null,
            });
    
            expect(result.items).toEqual(itemsRows);

            const [, options2] = sequelize.query.mock.calls[1];
            expect(options2.replacements).toEqual({
                indicatorCode: 'WBL_INDEX',
                locationIso3: 'FRA',
                yearFrom: 2010,
                yearTo: 2020,
                genderCode: 'FEMALE',
            });
        });
    
        it('throws 404 if the indicator is not found', async () => {
            sequelize.query.mockResolvedValue([]);
        
            await expect(
                ObservationService.getObservations({
                    indicatorCode: 'UNKNOWN',
                    locationIso3: 'FRA',
                })
            ).rejects.toBeInstanceOf(ApiError);
        
            await expect(
                ObservationService.getObservations({
                    indicatorCode: 'UNKNOWN',
                    locationIso3: 'FRA',
                })
            ).rejects.toMatchObject({
                statusCode: 404,
                message: 'Indicator not found',
            });
        });        
    });
  
    describe('getIndicatorRankings', () => {
        it('uses DESC sorting if higher_is_better = true', async () => {
            const indicatorRow = {
                code: 'WBL_INDEX',
                name: 'Index',
                description: null,
                higher_is_better: true,
                domain_code: 'LAW_INST',
                domain_name: 'Law',
                unit_code: 'INDEX100',
                unit_name: 'Index',
                symbol: null,
            };
    
            const rankingRows = [
                {
                    location_iso3: 'FRA',
                    location_name: 'France',
                    region: 'Europe',
                    income_group: 'High',
                    year: 2023,
                    value: 96.9,
                    rank: 1,
                },
            ];
    
            sequelize.query
                .mockResolvedValueOnce([indicatorRow])
                .mockResolvedValueOnce(rankingRows);
    
            const result = await ObservationService.getIndicatorRankings({
                indicatorCode: 'WBL_INDEX',
                limit: 10,
            });
    
            expect(result.indicator.code).toBe('WBL_INDEX');
            expect(result.latestYear).toBe(2023);
            expect(result.items[0]).toEqual({
                rank: 1,
                location: {
                    iso3: 'FRA',
                    name: 'France',
                    region: 'Europe',
                    incomeGroup: 'High',
                },
                year: 2023,
                value: 96.9,
            });
    
            const [sql2] = sequelize.query.mock.calls[1];
            expect(sql2).toContain('RANK() OVER (ORDER BY v.value DESC)');
        });
    
        it('uses ASC sort if higher_is_better = false', async () => {
            const indicatorRow = {
                code: 'UNODC_FEMICIDE_RATE_100K',
                name: 'Femicide rate',
                description: null,
                higher_is_better: false,
                domain_code: 'SAFETY_VIOLENCE',
                domain_name: 'Safety',
                unit_code: 'RATE_100K',
                unit_name: 'Rate per 100k',
                symbol: null,
            };
    
            sequelize.query
                .mockResolvedValueOnce([indicatorRow])
                .mockResolvedValueOnce([]);
    
            await ObservationService.getIndicatorRankings({
                indicatorCode: 'UNODC_FEMICIDE_RATE_100K',
                limit: 5,
            });
    
            const [sql2] = sequelize.query.mock.calls[1];
            expect(sql2).toContain('RANK() OVER (ORDER BY v.value ASC)');
        });
    
        it('throws 404 if the indicator is not found', async () => {
            sequelize.query.mockResolvedValue([]);
        
            await expect(
                ObservationService.getIndicatorRankings({
                    indicatorCode: 'UNKNOWN',
                })
            ).rejects.toBeInstanceOf(ApiError);
        
            await expect(
                ObservationService.getIndicatorRankings({
                    indicatorCode: 'UNKNOWN',
                })
            ).rejects.toMatchObject({
                statusCode: 404,
                message: 'Indicator not found',
            });
        });        
    });
});
  