import { useState, useEffect, useCallback } from 'react';
import { getSales, getFilterOptions } from '../services/api';

export const useSales = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
    const [filterOptions, setFilterOptions] = useState({ regions: [], genders: [], categories: [], paymentMethods: [], tags: [] });

    // Initial Filter State
    const [filters, setFilters] = useState({
        search: '',
        regions: [],
        genders: [],
        categories: [],
        paymentMethods: [],
        tags: [],
        ageMin: '',
        ageMax: '',
        dateStart: '',
        dateEnd: '',
        sortField: 'date',
        sortOrder: 'desc'
    });

    // Helper to format filters for API
    const getQueryParams = useCallback(() => {
        const params = {
            page: pagination.page,
            limit: pagination.limit,
            search: filters.search,
            sortField: filters.sortField,
            sortOrder: filters.sortOrder,
        };

        if (filters.regions.length) params.regions = filters.regions.join(',');
        if (filters.genders.length) params.genders = filters.genders.join(',');
        if (filters.categories.length) params.categories = filters.categories.join(',');
        if (filters.paymentMethods.length) params.paymentMethods = filters.paymentMethods.join(',');
        if (filters.tags.length) params.tags = filters.tags.join(',');
        if (filters.ageMin) params.ageMin = filters.ageMin;
        if (filters.ageMax) params.ageMax = filters.ageMax;
        if (filters.dateStart) params.dateStart = filters.dateStart;
        if (filters.dateEnd) params.dateEnd = filters.dateEnd;

        return params;
    }, [filters, pagination.page, pagination.limit]);

    // Fetch Data
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = getQueryParams();
            const result = await getSales(params);

            setData(result.data);
            setPagination(prev => ({
                ...prev,
                total: result.total,
                totalPages: result.totalPages
            }));
        } catch (err) {
            setError(err.message || 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    }, [getQueryParams]);

    // Fetch Options on Mount
    useEffect(() => {
        getFilterOptions().then(setFilterOptions).catch(console.error);
    }, []);

    // Fetch Data on Filter/Page Change
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSearch = (term) => {
        setFilters(prev => ({ ...prev, search: term }));
        setPagination(prev => ({ ...prev, page: 1 })); // Reset to page 1 on search
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const handleSortChange = (field) => {
        setFilters(prev => ({
            ...prev,
            sortField: field,
            sortOrder: prev.sortField === field && prev.sortOrder === 'desc' ? 'asc' : 'desc'
        }));
    };

    const handlePageChange = (newPage) => {
        setPagination(prev => ({ ...prev, page: newPage }));
    };

    return {
        data,
        loading,
        error,
        pagination,
        filters,
        filterOptions,
        handleSearch,
        handleFilterChange,
        handleSortChange,
        handlePageChange
    };
};
