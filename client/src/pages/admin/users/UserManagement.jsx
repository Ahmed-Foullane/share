import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import userService from '../../../services/userService';
import { useAuth } from '../../../hooks/useAuth';

const UserManagement = () => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [roleChangeModal, setRoleChangeModal] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const usersData = await userService.getAllUsers();
        setUsers(Array.isArray(usersData) ? usersData : []);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeleteClick = (user) => {
    const userRole = user.role || '';
    if (userRole === 'ADMIN' || userRole === 'admin' || user.id === currentUser?.id) return;
    setDeleteConfirmation(user);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmation) return;
    try {
      await userService.deleteUser(deleteConfirmation.id);
      setUsers(users.filter((u) => u.id !== deleteConfirmation.id));
      setDeleteConfirmation(null);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user.');
    }
  };

  const handleRoleChangeClick = (user) => {
    if (user.id === currentUser?.id) return;
    setRoleChangeModal(user);
  };

  const confirmRoleChange = async (newRole) => {
    if (!roleChangeModal) return;
    try {
      const updatedUser = await userService.changeUserRole(roleChangeModal.id, newRole);
      setUsers(users.map((u) => (u.id === roleChangeModal.id ? updatedUser : u)));
      setRoleChangeModal(null);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change user role.');
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
        <h1 className="text-2xl font-bold text-white">User Management</h1>
        <Link to="/admin" className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md">Back to Dashboard</Link>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <div className="bg-gray-800 shadow-md rounded-lg overflow-hidden border border-gray-700">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {users.length > 0 ? (
              users.map((user) => {
                const userRole = user.role || 'student';
                const isAdminUser = userRole === 'ADMIN' || userRole === 'admin' || userRole === 'ROLE_ADMIN';
                const firstName = user.firstName || user.first_name || '';
                const lastName = user.lastName || user.last_name || '';
                return (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{user.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{firstName} {lastName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      <div className="flex items-center">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${isAdminUser ? 'bg-red-900 text-red-300' : 'bg-green-900 text-green-300'}`}>
                          {userRole}
                        </span>
                        {user.id !== currentUser?.id && (
                          <button onClick={() => handleRoleChangeClick(user)} className="ml-2 text-indigo-400 hover:text-indigo-300 text-sm">Change</button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      <button
                        onClick={() => handleDeleteClick(user)}
                        className="text-red-400 hover:text-red-300"
                        disabled={isAdminUser || user.id === currentUser?.id}
                      >
                        {isAdminUser || user.id === currentUser?.id ? 'Cannot Delete' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr><td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-400">No users found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-96 max-w-full border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">Delete User</h3>
            <p className="mb-6 text-gray-300">
              Are you sure you want to delete user "{deleteConfirmation.firstName || deleteConfirmation.first_name} {deleteConfirmation.lastName || deleteConfirmation.last_name}"?
            </p>
            <div className="flex justify-end space-x-3">
              <button onClick={() => setDeleteConfirmation(null)} className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500">Cancel</button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}

      {roleChangeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-96 max-w-full border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">Change User Role</h3>
            <p className="mb-4 text-gray-300">
              Change role for <span className="font-semibold">{roleChangeModal.firstName || roleChangeModal.first_name} {roleChangeModal.lastName || roleChangeModal.last_name}</span>:
            </p>
            <div className="mb-6 space-y-2">
              {['YOUCODE_STUDENT', 'ADMIN'].map((role) => (
                <button
                  key={role}
                  className={`w-full text-left px-4 py-2 rounded-md ${roleChangeModal.role === role ? 'bg-blue-900 border border-blue-500 text-blue-300' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                  onClick={() => confirmRoleChange(role)}
                >
                  <span className={`font-medium ${role === 'ADMIN' ? 'text-red-400' : 'text-green-400'}`}>
                    {role}
                  </span>
                  {roleChangeModal.role === role && ' (Current)'}
                </button>
              ))}
            </div>
            <div className="flex justify-end">
              <button onClick={() => setRoleChangeModal(null)} className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
