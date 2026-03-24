import api from './api';

const friendService = {
  addFriend: async (userId, friendId) => {
    const response = await api.post(`/friends/${userId}`, { friendId });
    return response.data;
  },

  getFriends: async (userId) => {
    const response = await api.get(`/friends/user/${userId}`);
    return Array.isArray(response.data) ? response.data : [];
  },

  removeFriend: async (friendshipId) => {
    const response = await api.delete(`/friends/${friendshipId}`);
    return response.data;
  },
};

export default friendService;
