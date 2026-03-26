import api from './api';

const friendRequestService = {
  sendRequest: async (requestData) => {
    const response = await api.post('/friend-requests', requestData);
    return response.data;
  },

  getRequestById: async (id) => {
    const response = await api.get(`/friend-requests/${id}`);
    return response.data;
  },

  getAllRequests: async () => {
    const response = await api.get('/friend-requests');
    return Array.isArray(response.data) ? response.data : [];
  },

  getRequestsByStatus: async (status) => {
    const response = await api.get(`/friend-requests/status/${status}`);
    return Array.isArray(response.data) ? response.data : [];
  },

  acceptRequest: async (id) => {
    const response = await api.patch(`/friend-requests/${id}/accept`);
    return response.data;
  },

  declineRequest: async (id) => {
    const response = await api.patch(`/friend-requests/${id}/decline`);
    return response.data;
  },

  deleteRequest: async (id) => {
    const response = await api.delete(`/friend-requests/${id}`);
    return response.data;
  },
};

export default friendRequestService;
