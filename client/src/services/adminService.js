import api from './api';

const adminService = {
  getStatistics: async () => {
    const [users, articles, questions, comments, tags, categories] = await Promise.all([
      api.get('/users').catch(() => ({ data: [] })),
      api.get('/articles').catch(() => ({ data: [] })),
      api.get('/questions').catch(() => ({ data: [] })),
      api.get('/comments/question/0').catch(() => ({ data: [] })),
      api.get('/tags').catch(() => ({ data: [] })),
      api.get('/categories').catch(() => ({ data: [] })),
    ]);

    return {
      users_count: Array.isArray(users.data) ? users.data.length : 0,
      articles_count: Array.isArray(articles.data) ? articles.data.length : 0,
      questions_count: Array.isArray(questions.data) ? questions.data.length : 0,
      comments_count: 0,
      tags_count: Array.isArray(tags.data) ? tags.data.length : 0,
      categories_count: Array.isArray(categories.data) ? categories.data.length : 0,
    };
  },

  getAllUsers: async () => {
    const response = await api.get('/users');
    return Array.isArray(response.data) ? response.data : [];
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  getAllArticles: async () => {
    const response = await api.get('/articles');
    return Array.isArray(response.data) ? response.data : [];
  },

  deleteArticle: async (id) => {
    const response = await api.delete(`/articles/${id}`);
    return response.data;
  },

  getAllQuestions: async () => {
    const response = await api.get('/questions');
    return Array.isArray(response.data) ? response.data : [];
  },

  deleteQuestion: async (id) => {
    const response = await api.delete(`/questions/${id}`);
    return response.data;
  },

  getAllComments: async () => {
    return [];
  },

  deleteComment: async (id) => {
    const response = await api.delete(`/comments/${id}`);
    return response.data;
  },
};

export default adminService;
