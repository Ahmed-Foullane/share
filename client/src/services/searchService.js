import api from './api';

const searchService = {
  createSearch: async (text) => {
    const response = await api.post('/search', { text });
    return response.data;
  },

  getAllSearches: async () => {
    const response = await api.get('/search');
    return Array.isArray(response.data) ? response.data : [];
  },

  searchByQuery: async (text) => {
    const response = await api.get(`/search/query?text=${encodeURIComponent(text)}`);
    return Array.isArray(response.data) ? response.data : [];
  },

  deleteSearch: async (id) => {
    const response = await api.delete(`/search/${id}`);
    return response.data;
  },

  deleteAllSearches: async () => {
    const response = await api.delete('/search');
    return response.data;
  },
};

export default searchService;
