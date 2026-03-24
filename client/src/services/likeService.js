import api from './api';
import authService from './authService';

const likeService = {
  toggleLike: async (likeableType, likeableId) => {
    const studentId = authService.getStudentId();
    if (!studentId) throw new Error('Student profile not found. Please re-login.');
    const response = await api.post(`/likes/${studentId}`, { likeableType, likeableId: parseInt(likeableId) });
    return response.data;
  },

  getLikes: async (likeableType, likeableId) => {
    const response = await api.get(`/likes/${likeableType}/${likeableId}`);
    return response.data;
  },

  getLikeCount: async (likeableType, likeableId) => {
    const response = await api.get(`/likes/${likeableType}/${likeableId}/count`);
    return response.data;
  },
};

export default likeService;
