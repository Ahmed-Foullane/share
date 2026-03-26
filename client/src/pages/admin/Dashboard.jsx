import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import adminService from '../../services/adminService';

const AdminDashboard = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }

    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const data = await adminService.getStatistics();
        setStats(data);
      } catch {
        setError('Failed to load statistics.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [isAdmin, navigate]);

  if (!isAdmin) return null;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg font-medium text-white">Loading...</p>
      </div>
    );
  }

  if (error) {
    return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>;
  }

  const statCards = [
    { label: 'Total Users', value: stats?.users_count || 0, color: 'blue', icon: 'M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z' },
    { label: 'Articles', value: stats?.articles_count || 0, color: 'green', icon: 'M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z' },
    { label: 'Questions', value: stats?.questions_count || 0, color: 'purple', icon: 'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z' },
    { label: 'Tags', value: stats?.tags_count || 0, color: 'red', icon: 'M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z' },
    { label: 'Categories', value: stats?.categories_count || 0, color: 'indigo', icon: 'M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z' },
  ];

  const colorMap = {
    blue: 'bg-blue-900 text-blue-400',
    green: 'bg-green-900 text-green-400',
    purple: 'bg-purple-900 text-purple-400',
    red: 'bg-red-900 text-red-400',
    indigo: 'bg-indigo-900 text-indigo-400',
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${colorMap[card.color]} mr-4`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d={card.icon} clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <div className="text-gray-400">{card.label}</div>
                <div className="text-2xl font-bold text-white">{card.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-white mb-4">Management</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { to: '/admin/users', label: 'Manage Users', color: 'text-blue-400' },
          { to: '/admin/articles', label: 'Manage Articles', color: 'text-green-400' },
          { to: '/admin/questions', label: 'Manage Questions', color: 'text-purple-400' },
          { to: '/admin/categories', label: 'Manage Categories', color: 'text-indigo-400' },
          { to: '/admin/tags', label: 'Manage Tags', color: 'text-red-400' },
          { to: '/admin/comments', label: 'Manage Comments', color: 'text-yellow-400' },
        ].map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="bg-gray-800 p-4 rounded-lg shadow hover:shadow-md border border-gray-700 hover:border-gray-600 flex items-center transition-all"
          >
            <span className={`${item.color} mr-2 font-medium`}>{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
