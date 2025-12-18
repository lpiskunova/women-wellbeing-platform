jest.mock('../../../config/database', () => ({
    sequelize: {
      query: jest.fn(),
    },
  }));
  
  const { sequelize } = require('../../../config/database');
  const LocationService = require('../../../services/locations.service');
  const ApiError = require('../../../utils/ApiError');
  
  describe('LocationService (unit)', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('listLocations returns total and items', async () => {
      const fakeItems = [
        {
          id: 1,
          type: 'country',
          iso3: 'FRA',
          name: 'France',
          region: 'Europe & Central Asia',
          income_group: 'High income',
          coverage_score: 90.0,
          freshness_score: 100.0,
          note: null,
        },
      ];
      const fakeCountRow = { total: 1 };
  
      sequelize.query
        .mockResolvedValueOnce(fakeItems)
        .mockResolvedValueOnce([fakeCountRow]);
  
      const result = await LocationService.listLocations({
        q: null,
        region: null,
        limit: 5,
        offset: 0,
      });
  
      expect(result).toEqual({
        total: 1,
        items: fakeItems,
      });
  
      expect(sequelize.query).toHaveBeenCalledTimes(2);
  
      const [, options1] = sequelize.query.mock.calls[0];
      expect(options1.replacements).toEqual({ limit: 5, offset: 0 });
    });
  
    it('listLocations passes q and region to replacements', async () => {
      sequelize.query
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([{ total: 0 }]);
  
      await LocationService.listLocations({
        q: 'fra',
        region: 'Europe',
        limit: 10,
        offset: 2,
      });
  
      const [, options] = sequelize.query.mock.calls[0];
  
      expect(options.replacements).toEqual({
        limit: 10,
        offset: 2,
        q: '%fra%',
        region: 'Europe',
      });
    });
  
    it('getByIso3 returns the country on success', async () => {
      const row = {
        id: 1,
        type: 'country',
        iso3: 'FRA',
        name: 'France',
        region: 'Europe',
        income_group: 'High',
        coverage_score: 90.0,
        freshness_score: 100.0,
        note: null,
      };
  
      sequelize.query.mockResolvedValueOnce([row]);
  
      const result = await LocationService.getByIso3('FRA');
  
      expect(result).toEqual(row);
      expect(sequelize.query).toHaveBeenCalledTimes(1);
    });
  
    it('getByIso3 returns a 404 if the country is not found', async () => {
        sequelize.query.mockResolvedValue([]);
      
        await expect(
          LocationService.getByIso3('XXX')
        ).rejects.toBeInstanceOf(ApiError);
      
        await expect(
          LocationService.getByIso3('XXX')
        ).rejects.toMatchObject({
          statusCode: 404,
          message: 'Location not found',
        });
    });      
});
  