import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import questionService from '../../services/questionService';

const QuestionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      const fetchQuestion = async () => {
        try {
          setIsLoading(true);
          const question = await questionService.getQuestionById(id);
          setFormData({
            title: question.title || '',
            description: question.description || '',
          });
        } catch {
          setErrors({ general: 'Could not load question data. Please try again.' });
        } finally {
          setIsLoading(false);
        }
      };
      fetchQuestion();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      let result;
      if (isEditMode) {
        result = await questionService.updateQuestion(id, formData);
        navigate(`/questions/${id}`);
      } else {
        result = await questionService.createQuestion(formData);
        navigate(`/questions/${result.id || ''}`);
      }
    } catch (error) {
      if (error.response?.data?.errors) {
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
      <h1 className="text-2xl font-bold text-white mb-6">{isEditMode ? 'Edit Question' : 'Ask a Question'}</h1>

      {errors.general && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{errors.general}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg shadow-lg p-6 space-y-6 border border-gray-700">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">Question Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full px-3 py-2 bg-gray-700 border ${errors.title ? 'border-red-500' : 'border-gray-600'} rounded-md text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            placeholder="What's your question? Be specific."
          />
          {errors.title && <div className="text-red-500 mt-1">{errors.title[0] || errors.title}</div>}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Question Details</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={12}
            className={`w-full px-3 py-2 bg-gray-700 border ${errors.description ? 'border-red-500' : 'border-gray-600'} rounded-md text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            placeholder="Provide details about your question..."
          />
          {errors.description && <div className="text-red-500 mt-1">{errors.description[0] || errors.description}</div>}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (isEditMode ? 'Updating...' : 'Posting...') : (isEditMode ? 'Update Question' : 'Post Question')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuestionForm;
