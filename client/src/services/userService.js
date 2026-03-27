import api from './api';

const userService = {
  getAllUsers: async () => {
    try {
      const response = await api.get('/users');
      return Array.isArray(response.data) ? response.data : [];
    } catch {
      return [];
    }
  },

  getUserByEmail: async (email) => {
    const response = await api.get(`/users/search?email=${encodeURIComponent(email)}`);
    return response.data;
  },

  /** App user id → student id (for messages, articles author id, etc.) */
  getStudentIdForUser: async (userId) => {
    const response = await api.get(`/users/${userId}/student`);
    return response.data?.studentId ?? null;
  },

  createUser: async (role, userData) => {
    const response = await api.post(`/users/${role}`, userData);
    return response.data;
  },

  changeUserRole: async (userId, role) => {
    const response = await api.patch(`/users/${userId}/role/${role}`);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};

export default userService;
