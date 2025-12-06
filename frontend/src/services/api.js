import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

export const getSales = async (params) => {
    const response = await api.get('/sales', { params });
    return response.data;
};

export const getFilterOptions = async () => {
    const response = await api.get('/sales/options');
    return response.data;
};
