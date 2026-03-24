import api from './api';
import authService from './authService';
import likeService from './likeService';

const commentService = {
  getCommentsByQuestion: async (questionId) => {
    const response = await api.get(`/comments/question/${questionId}`);
    return Array.isArray(response.data) ? response.data : [];
  },

  getCommentById: async (id) => {
    const response = await api.get(`/comments/${id}`);
    return response.data;
  },

  createComment: async (questionId, content) => {
    const studentId = authService.getStudentId();
    if (!studentId) throw new Error('Student profile not found. Please re-login.');

    const response = await api.post(`/comments/${studentId}`, {
      content,
      questionId: parseInt(questionId),
    });
    return response.data;
  },

  updateComment: async (id, content, questionId) => {
    const response = await api.put(`/comments/${id}`, {
      content,
      questionId: parseInt(questionId),
    });
    return response.data;
  },

  deleteComment: async (id) => {
    const response = await api.delete(`/comments/${id}`);
    return response.data;
  },

  markAsAccepted: async (id) => {
    const response = await api.patch(`/comments/${id}/accept`);
    return response.data;
  },

  toggleVote: async (commentId) => {
    return likeService.toggleLike('comment', commentId);
  },

  checkUserVoted: async (commentId) => {
    try {
      const likes = await likeService.getLikes('comment', commentId);
      const studentId = authService.getStudentId();
      const liked = Array.isArray(likes) && likes.some((l) => String(l.studentId) === String(studentId));
      return { liked, count: Array.isArray(likes) ? likes.length : 0 };
    } catch {
      return { liked: false, count: 0 };
    }
  },
};

export default commentService;
