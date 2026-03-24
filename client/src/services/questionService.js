import api from './api';
import authService from './authService';
import likeService from './likeService';

const questionService = {
  getAllQuestions: async () => {
    const response = await api.get('/questions');
    return Array.isArray(response.data) ? response.data : [];
  },

  getQuestionById: async (id) => {
    const response = await api.get(`/questions/${id}`);
    return response.data;
  },

  createQuestion: async (questionData) => {
    const studentId = authService.getStudentId();
    if (!studentId) throw new Error('Student profile not found. Please re-login.');

    const payload = {
      title: questionData.title,
      description: questionData.description,
    };

    const response = await api.post(`/questions/${studentId}`, payload);
    return response.data;
  },

  updateQuestion: async (id, questionData) => {
    const payload = {
      title: questionData.title,
      description: questionData.description,
    };

    const response = await api.put(`/questions/${id}`, payload);
    return response.data;
  },

  deleteQuestion: async (id) => {
    const response = await api.delete(`/questions/${id}`);
    return response.data;
  },

  searchQuestions: async (title) => {
    const response = await api.get(`/questions/search?title=${encodeURIComponent(title)}`);
    return Array.isArray(response.data) ? response.data : [];
  },

  getQuestionsByAuthor: async (authorId) => {
    const response = await api.get(`/questions/author/${authorId}`);
    return Array.isArray(response.data) ? response.data : [];
  },

  toggleVote: async (questionId) => {
    return likeService.toggleLike('question', questionId);
  },

  getLikeCount: async (questionId) => {
    try {
      return await likeService.getLikeCount('question', questionId);
    } catch {
      return 0;
    }
  },

  checkUserVoted: async (questionId) => {
    try {
      const likes = await likeService.getLikes('question', questionId);
      const studentId = authService.getStudentId();
      const liked = Array.isArray(likes) && likes.some((l) => String(l.studentId) === String(studentId));
      return { liked, count: Array.isArray(likes) ? likes.length : 0 };
    } catch {
      return { liked: false, count: 0 };
    }
  },
};

export default questionService;
