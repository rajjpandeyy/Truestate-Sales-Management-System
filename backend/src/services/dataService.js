const { initDB, getDB } = require('./db');

class DataService {
    constructor() {
        // No local data storage
    }

    async loadData() {
        // Delegate to DB Service
        await initDB();
    }

    query({ search, filters, sort, page = 1, limit = 10 }) {
        const db = getDB();
        let query = 'SELECT * FROM transactions WHERE 1=1';
        let params = {};

        // 1. Search (Full Text on Name, Phone)
        if (search) {
            query += ' AND (lower(customerName) LIKE @search OR phone LIKE @search)';
            params.search = `%${search.toLowerCase()}%`;
        }

        // 2. Filters
        if (filters) {
            if (filters.regions && filters.regions.length > 0) {
                // SQLite doesn't support arrays directly, dynamic IN clause needed
                const placeholders = filters.regions.map((_, i) => `@region${i}`).join(',');
                query += ` AND region IN (${placeholders})`;
                filters.regions.forEach((r, i) => params[`region${i}`] = r);
            }
            if (filters.genders && filters.genders.length > 0) {
                const placeholders = filters.genders.map((_, i) => `@gender${i}`).join(',');
                query += ` AND gender IN (${placeholders})`;
                filters.genders.forEach((r, i) => params[`gender${i}`] = r);
            }
            if (filters.categories && filters.categories.length > 0) {
                const placeholders = filters.categories.map((_, i) => `@cat${i}`).join(',');
                query += ` AND productCategory IN (${placeholders})`;
                filters.categories.forEach((r, i) => params[`cat${i}`] = r);
            }
            if (filters.paymentMethods && filters.paymentMethods.length > 0) {
                const placeholders = filters.paymentMethods.map((_, i) => `@pm${i}`).join(',');
                query += ` AND paymentMethod IN (${placeholders})`;
                filters.paymentMethods.forEach((r, i) => params[`pm${i}`] = r);
            }
            if (filters.tags && filters.tags.length > 0) {
                // Approximate tag search using LIKE for each tag
                const tagConditions = filters.tags.map((_, i) => `tags LIKE @tag${i}`).join(' OR ');
                query += ` AND (${tagConditions})`;
                filters.tags.forEach((tag, i) => params[`tag${i}`] = `%${tag}%`);
            }
            if (filters.ageMin !== undefined && filters.ageMax !== undefined) {
                query += ' AND age >= @ageMin AND age <= @ageMax';
                params.ageMin = filters.ageMin;
                params.ageMax = filters.ageMax;
            }
            if (filters.dateStart || filters.dateEnd) {
                if (filters.dateStart) {
                    query += ' AND date >= @dateStart';
                    params.dateStart = filters.dateStart;
                }
                if (filters.dateEnd) {
                    query += ' AND date <= @dateEnd';
                    params.dateEnd = filters.dateEnd;
                }
            }
        }

        // Count Query (optimized reuse)
        const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
        const totalResult = db.prepare(countQuery).get(params);
        const total = totalResult ? totalResult.total : 0;

        // 3. Sorting
        if (sort) {
            let sortField = sort.field;
            // Map frontend sort fields to DB columns safe list
            const allowedSorts = {
                'date': 'date',
                'quantity': 'quantity',
                'name': 'customerName',
                'customerName': 'customerName',
                'totalAmount': 'price', // Sort by numeric price, not string amount
                'price': 'price'
            };

            if (allowedSorts[sortField]) {
                const order = sort.order === 'asc' ? 'ASC' : 'DESC';
                // For date string sorting in YYYY-MM-DD, standard string sort works.
                query += ` ORDER BY ${allowedSorts[sortField]} ${order}`;
            }
        }

        // 4. Pagination
        const pLimit = parseInt(limit, 10);
        const pOffset = (parseInt(page, 10) - 1) * pLimit;
        query += ` LIMIT @limit OFFSET @offset`;
        params.limit = pLimit;
        params.offset = pOffset;

        const data = db.prepare(query).all(params);

        return {
            total: total,
            page: parseInt(page, 10),
            limit: pLimit,
            totalPages: Math.ceil(total / pLimit),
            data: data.map(item => ({
                ...item,
                tags: item.tags ? item.tags.split(',') : [] // Hydrate tags back to array
            }))
        };
    }

    // Helper to get unique values for filter options
    getFilterOptions() {
        const db = getDB();
        // Optimized distinct queries
        const getList = (col) => db.prepare(`SELECT DISTINCT ${col} FROM transactions ORDER BY ${col}`).all().map(r => r[col]);

        const regions = getList('region');
        const genders = getList('gender');
        const categories = getList('productCategory');
        const paymentMethods = getList('paymentMethod');

        // Tags is comma separated string in DB, need to split and distinct manually or use costly query.
        // For performance on 300k+ rows, doing it in memory on distinct rows is okay or using a rough approach.
        // Better approach: Since tags are limited, fetch distinct tags column and split in JS.
        const rawTags = db.prepare('SELECT DISTINCT tags FROM transactions').all();
        const tagsSet = new Set();
        rawTags.forEach(r => {
            if (r.tags) r.tags.split(',').forEach(t => tagsSet.add(t.trim()));
        });
        const tags = [...tagsSet].sort();

        return { regions, genders, categories, paymentMethods, tags };
    }
}

module.exports = new DataService();
