import { Link } from 'react-router-dom';

const UserCard = ({ user }) => {
  const firstName = user.firstName || user.first_name || '';
  const lastName = user.lastName || user.last_name || '';

  const getInitials = () => {
    if (!firstName && !lastName) return 'U';
    return `${firstName ? firstName[0] : ''}${lastName ? lastName[0] : ''}`;
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-6 flex flex-col items-center border border-gray-700">
      <div className="relative mb-4">
        <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold border-4 border-gray-600">
          {getInitials()}
        </div>
      </div>

      <h3 className="text-xl font-semibold text-white mb-1">{firstName} {lastName}</h3>
      <p className="text-gray-400 text-sm mb-4">{user.email}</p>

      <div className="flex space-x-2 w-full">
        <Link
          to={`/messages?user=${user.id}`}
          className="flex-1 px-3 py-2 bg-blue-600 text-white text-center rounded-md hover:bg-blue-700 transition-colors text-sm"
        >
          Message
        </Link>
      </div>
    </div>
  );
};

export default UserCard;
