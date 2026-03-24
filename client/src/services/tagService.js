import api from './api';

const tagService = {
  getAllTags: async () => {
    try {
      const response = await api.get('/tags');
      return Array.isArray(response.data) ? response.data : [];
    } catch {
      return [];
    }
  },

  getTagById: async (id) => {
    const response = await api.get(`/tags/${id}`);
    return response.data;
  },

  createTag: async (name) => {
    const response = await api.post('/tags', { name });
    return response.data;
  },

  updateTag: async (id, name) => {
    const response = await api.put(`/tags/${id}`, { name });
    return response.data;
  },

  deleteTag: async (id) => {
    const response = await api.delete(`/tags/${id}`);
    return response.data;
  },
};

export default tagService;
