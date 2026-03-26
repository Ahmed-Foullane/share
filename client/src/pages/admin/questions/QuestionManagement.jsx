import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../../../services/adminService';

const QuestionManagement = () => {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        const data = await adminService.getAllQuestions();
        setQuestions(Array.isArray(data) ? data : []);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const confirmDelete = async () => {
    if (!deleteConfirmation) return;
    await adminService.deleteQuestion(deleteConfirmation.id);
    setQuestions(questions.filter((q) => q.id !== deleteConfirmation.id));
    setDeleteConfirmation(null);
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Question Management</h1>
        <Link to="/admin" className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md">Back to Dashboard</Link>
      </div>

      <div className="bg-gray-800 shadow-md rounded-lg overflow-hidden border border-gray-700">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Author ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Votes</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {questions.length > 0 ? (
              questions.map((question) => (
                <tr key={question.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{question.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link to={`/questions/${question.id}`} className="text-blue-400 hover:text-blue-300">{question.title}</Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{question.authorId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{question.votes || 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{formatDate(question.date)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    <button onClick={() => setDeleteConfirmation(question)} className="text-red-400 hover:text-red-300">Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-400">No questions found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-96 max-w-full border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">Delete Question</h3>
            <p className="mb-6 text-gray-300">Are you sure you want to delete question "{deleteConfirmation.title}"?</p>
            <div className="flex justify-end space-x-3">
              <button onClick={() => setDeleteConfirmation(null)} className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500">Cancel</button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionManagement;
