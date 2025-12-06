const dataService = require('../services/dataService');

exports.getSales = (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search = '',
            regions,
            genders,
            categories,
            paymentMethods,
            tags,
            sortField = 'date',
            sortOrder = 'desc',
            ageMin,
            ageMax,
            dateStart,
            dateEnd
        } = req.query;

        const filters = {
            regions: regions ? regions.split(',') : [],
            genders: genders ? genders.split(',') : [],
            categories: categories ? categories.split(',') : [],
            paymentMethods: paymentMethods ? paymentMethods.split(',') : [],
            tags: tags ? tags.split(',') : [],
            ageMin: ageMin ? parseInt(ageMin) : undefined,
            ageMax: ageMax ? parseInt(ageMax) : undefined,
            dateStart,
            dateEnd
        };

        const sort = { field: sortField, order: sortOrder };

        const result = dataService.query({
            search,
            filters,
            sort,
            page,
            limit
        });

        res.json(result);
    } catch (error) {
        console.error('Error fetching sales:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getFilterOptions = (req, res) => {
    try {
        const options = dataService.getFilterOptions();
        res.json(options);
    } catch (error) {
        console.error('Error fetching filter options:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
