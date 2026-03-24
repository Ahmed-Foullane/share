import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import tagService from '../../../services/tagService';

const TagManagement = () => {
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [newTag, setNewTag] = useState({ name: '' });
  const [editingTag, setEditingTag] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setIsLoading(true);
        const data = await tagService.getAllTags();
        setTags(Array.isArray(data) ? data : []);
      } catch {
        setError('Failed to load tags.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTags();
  }, []);

  const confirmDelete = async () => {
    if (!deleteConfirmation) return;
    try {
      await tagService.deleteTag(deleteConfirmation.id);
      setTags(tags.filter((t) => t.id !== deleteConfirmation.id));
      setDeleteConfirmation(null);
    } catch {
      setError('Failed to delete tag.');
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const created = await tagService.createTag(newTag.name);
      setTags([...tags, created]);
      setNewTag({ name: '' });
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create tag.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const updated = await tagService.updateTag(editingTag.id, editingTag.name);
      setTags(tags.map((t) => (t.id === editingTag.id ? updated : t)));
      setEditingTag(null);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update tag.');
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Tag Management</h1>
        <Link to="/admin" className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md">Back to Dashboard</Link>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <div className="bg-gray-800 shadow-md rounded-lg p-6 mb-6 border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-4">Create New Tag</h2>
        <form onSubmit={handleCreateSubmit} className="flex gap-4">
          <input
            className="flex-1 shadow appearance-none border border-gray-600 bg-gray-700 rounded py-2 px-3 text-white leading-tight focus:outline-none focus:border-blue-500"
            type="text"
            placeholder="Tag name"
            value={newTag.name}
            onChange={(e) => setNewTag({ name: e.target.value })}
            required
          />
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create'}
          </button>
        </form>
      </div>

      <div className="bg-gray-800 shadow-md rounded-lg overflow-hidden border border-gray-700">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {tags.length > 0 ? (
              tags.map((tag) => (
                <tr key={tag.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{tag.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{tag.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    <div className="flex space-x-2">
                      <button onClick={() => setEditingTag({ ...tag })} className="text-blue-400 hover:text-blue-300">Edit</button>
                      <button onClick={() => setDeleteConfirmation(tag)} className="text-red-400 hover:text-red-300">Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-400">No tags found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editingTag && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-96 max-w-full border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">Edit Tag</h3>
            <form onSubmit={handleUpdateSubmit}>
              <input
                className="w-full shadow appearance-none border border-gray-600 bg-gray-700 rounded py-2 px-3 text-white mb-4 focus:outline-none focus:border-blue-500"
                type="text"
                value={editingTag.name}
                onChange={(e) => setEditingTag({ ...editingTag, name: e.target.value })}
                required
              />
              <div className="flex justify-end space-x-3">
                <button type="button" onClick={() => setEditingTag(null)} className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-96 max-w-full border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">Delete Tag</h3>
            <p className="mb-6 text-gray-300">Are you sure you want to delete tag "{deleteConfirmation.name}"?</p>
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

export default TagManagement;
