import api from './api';

const messageService = {
  sendMessage: async (senderId, content, receiverId) => {
    const response = await api.post(`/messages/${senderId}`, { content, receiverId: parseInt(receiverId) });
    return response.data;
  },

  getConversation: async (userId1, userId2) => {
    const response = await api.get(`/messages/conversation/${userId1}/${userId2}`);
    return Array.isArray(response.data) ? response.data : [];
  },

  getUserMessages: async (userId) => {
    const response = await api.get(`/messages/user/${userId}`);
    return Array.isArray(response.data) ? response.data : [];
  },

  getUnreadMessages: async (receiverId) => {
    const response = await api.get(`/messages/unread/${receiverId}`);
    return Array.isArray(response.data) ? response.data : [];
  },

  markAsRead: async (messageId) => {
    const response = await api.patch(`/messages/${messageId}/read`);
    return response.data;
  },

  deleteMessage: async (messageId) => {
    const response = await api.delete(`/messages/${messageId}`);
    return response.data;
  },
};

export default messageService;
