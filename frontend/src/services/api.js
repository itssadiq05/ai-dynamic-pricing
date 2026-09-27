import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getDashboardSummary = () => api.get('/dashboard/summary');
export const getDashboardCharts = () => api.get('/dashboard/charts');
export const getProducts = () => api.get('/products');
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);
export const getSales = (params) => api.get('/sales', { params });
export const createSale = (data) => api.post('/sales', data);
export const predictDemand = (data) => api.post('/predict/demand', data);
export const getDemandForecast = (productId, days) => api.get(`/predict/demand/forecast/${productId}?days=${days}`);
export const getPriceRecommendation = (data) => api.post('/recommend/price', data);
export const getModelMetrics = () => api.get('/model/metrics');

export default api;

