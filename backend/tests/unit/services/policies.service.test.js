jest.mock('../../../config/database', () => ({
    sequelize: {
      query: jest.fn(),
    },
}));
  
const { sequelize } = require('../../../config/database');
const PolicyService = require('../../../services/policies.service');
  
describe('PolicyService (unit)', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('listPolicies returns items without filters', async () => {
        const rows = [
            {
                id: 1,
                location_iso3: 'FRA',
                country: 'France',
                year: 2015,
                form_of_violence: 'Violence against women and girls',
                measure_type: 'Laws > Violence against women > Legislation',
                title: 'Law No. ...',
            },
        ];
    
        sequelize.query.mockResolvedValueOnce(rows);
    
        const result = await PolicyService.listPolicies({});
    
        expect(result).toEqual({ items: rows });
        expect(sequelize.query).toHaveBeenCalledTimes(1);
    });
  
    it('listPolicies passes filters through replacements', async () => {
        sequelize.query.mockResolvedValueOnce([]);
    
        await PolicyService.listPolicies({
            locationIso3: 'FRA',
            yearFrom: 2000,
            yearTo: 2020,
            formOfViolence: 'Violence against women and girls',
            measureType: 'Laws > Violence against women > Legislation',
        });
    
        const [, options] = sequelize.query.mock.calls[0];
    
        expect(options.replacements).toEqual({
            locationIso3: 'FRA',
            yearFrom: 2000,
            yearTo: 2020,
            formOfViolence: 'Violence against women and girls',
            measureType: 'Laws > Violence against women > Legislation',
        });
    });
});
  