import api from './api';
import authService from './authService';
import likeService from './likeService';

const articleService = {
  getAllArticles: async () => {
    const response = await api.get('/articles');
    return Array.isArray(response.data) ? response.data : [];
  },

  getArticleById: async (id) => {
    const response = await api.get(`/articles/${id}`);
    return response.data;
  },

  createArticle: async (articleData) => {
    const studentId = authService.getStudentId();
    if (!studentId) throw new Error('Student profile not found. Please re-login.');

    const rawCategory = articleData.categoryId ?? articleData.category_id;
    const categoryId =
      rawCategory === '' || rawCategory == null ? NaN : parseInt(String(rawCategory), 10);
    if (Number.isNaN(categoryId)) {
      throw new Error('Please select a category.');
    }

    const payload = {
      title: articleData.title,
      content: articleData.content,
      categoryId,
    };

    const response = await api.post(`/articles/${studentId}`, payload);
    return response.data;
  },

  updateArticle: async (id, articleData) => {
    const rawCategory = articleData.categoryId ?? articleData.category_id;
    const categoryId =
      rawCategory === '' || rawCategory == null ? NaN : parseInt(String(rawCategory), 10);
    if (Number.isNaN(categoryId)) {
      throw new Error('Please select a category.');
    }

    const payload = {
      title: articleData.title,
      content: articleData.content,
      categoryId,
    };

    const response = await api.put(`/articles/${id}`, payload);
    return response.data;
  },

  deleteArticle: async (id) => {
    const response = await api.delete(`/articles/${id}`);
    return response.data;
  },

  searchArticles: async (title) => {
    const response = await api.get(`/articles/search?title=${encodeURIComponent(title)}`);
    return Array.isArray(response.data) ? response.data : [];
  },

  getArticlesByCategory: async (categoryId) => {
    const response = await api.get(`/articles/category/${categoryId}`);
    return Array.isArray(response.data) ? response.data : [];
  },

  getArticlesByAuthor: async (authorId) => {
    const response = await api.get(`/articles/author/${authorId}`);
    return Array.isArray(response.data) ? response.data : [];
  },

  toggleLike: async (articleId) => {
    return likeService.toggleLike('article', articleId);
  },

  getLikeCount: async (articleId) => {
    try {
      return await likeService.getLikeCount('article', articleId);
    } catch {
      return 0;
    }
  },

  checkUserLiked: async (articleId) => {
    try {
      const likes = await likeService.getLikes('article', articleId);
      const studentId = authService.getStudentId();
      const liked = Array.isArray(likes) && likes.some((l) => String(l.studentId) === String(studentId));
      return { liked, count: Array.isArray(likes) ? likes.length : 0 };
    } catch {
      return { liked: false, count: 0 };
    }
  },
};

export default articleService;
