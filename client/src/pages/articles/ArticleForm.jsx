import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import articleService from '../../services/articleService';
import categoryService from '../../services/categoryService';

const ArticleForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category_id: '',
  });
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchFormData = async () => {
      setIsLoading(true);

      const categoriesRes = await categoryService.getAllCategories();
      setCategories(Array.isArray(categoriesRes) ? categoriesRes : []);

      if (isEditMode) {
        try {
          const article = await articleService.getArticleById(id);
          setFormData({
            title: article.title || '',
            content: article.content || '',
            category_id: article.categoryId ? article.categoryId.toString() : '',
          });
        } catch {
          setErrors({ general: 'Could not load article data.' });
        }
      }

      setIsLoading(false);
    };

    fetchFormData();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const next = {};
    if (!formData.title?.trim()) next.title = ['Title is required'];
    if (!formData.content?.trim()) next.content = ['Content is required'];
    if (!formData.category_id) next.category_id = ['Please select a category'];
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const payload = {
        title: formData.title,
        content: formData.content,
        category_id: formData.category_id,
      };

      let result;
      if (isEditMode) {
        result = await articleService.updateArticle(id, payload);
        navigate(`/articles/${id}`);
      } else {
        result = await articleService.createArticle(payload);
        navigate(`/articles/${result.id || ''}`);
      }
    } catch (error) {
      if (error.message && !error.response) {
        setErrors({ general: error.message });
      } else if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: error.response?.data?.message || 'An error occurred. Please try again later.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg font-medium text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">{isEditMode ? 'Edit Article' : 'Create New Article'}</h1>

      {errors.general && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{errors.general}</div>
      )}

      {categories.length === 0 && (
        <div className="bg-amber-900 border border-amber-700 text-amber-200 px-4 py-3 rounded mb-4">
          No categories exist yet. An admin must create at least one category (Admin → Categories) before you can publish an article.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full px-3 py-2 bg-gray-700 border ${errors.title ? 'border-red-500' : 'border-gray-600'} rounded-md text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            placeholder="Enter article title"
          />
          {errors.title && <div className="text-red-500 mt-1">{errors.title[0] || errors.title}</div>}
        </div>

        <div>
          <label htmlFor="category_id" className="block text-sm font-medium text-gray-300 mb-1">Category</label>
          <select
            id="category_id"
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            className={`w-full px-3 py-2 bg-gray-700 border ${errors.category_id ? 'border-red-500' : 'border-gray-600'} rounded-md text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          {errors.category_id && <div className="text-red-500 mt-1">{errors.category_id[0] || errors.category_id}</div>}
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-1">Content</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={15}
            className={`w-full px-3 py-2 bg-gray-700 border ${errors.content ? 'border-red-500' : 'border-gray-600'} rounded-md text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            placeholder="Write your article content here..."
          />
          {errors.content && <div className="text-red-500 mt-1">{errors.content[0] || errors.content}</div>}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (isEditMode ? 'Updating...' : 'Publishing...') : (isEditMode ? 'Update Article' : 'Publish Article')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ArticleForm;
