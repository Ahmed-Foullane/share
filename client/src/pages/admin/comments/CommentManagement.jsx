import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import commentService from '../../../services/commentService';

const CommentManagement = () => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  useEffect(() => {
    setIsLoading(false);
    setComments([]);
  }, []);

  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const confirmDelete = async () => {
    if (!deleteConfirmation) return;
    try {
      await commentService.deleteComment(deleteConfirmation.id);
      setComments(comments.filter((c) => c.id !== deleteConfirmation.id));
      setDeleteConfirmation(null);
    } catch (err) {
      console.error('Error deleting comment:', err);
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Comment Management</h1>
        <Link to="/admin" className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md">Back to Dashboard</Link>
      </div>

      <div className="bg-gray-800 shadow-md rounded-lg overflow-hidden border border-gray-700">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Content</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Author ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Question ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <tr key={comment.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{comment.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{truncateText(comment.content)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{comment.authorId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    <Link to={`/questions/${comment.questionId}`} className="text-blue-400 hover:text-blue-300">
                      Question #{comment.questionId}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    <button onClick={() => setDeleteConfirmation(comment)} className="text-red-400 hover:text-red-300">Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-400">No comments found. Comments are managed per question.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-96 max-w-full border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">Delete Comment</h3>
            <p className="mb-2 text-gray-300">Are you sure you want to delete this comment?</p>
            <div className="bg-gray-700 p-3 rounded mb-4">
              <p className="text-sm text-gray-300">{deleteConfirmation.content}</p>
            </div>
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

export default CommentManagement;
