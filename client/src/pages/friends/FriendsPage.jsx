import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import friendService from '../../services/friendService';
import userService from '../../services/userService';

const FriendsPage = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('friends');
  const [friends, setFriends] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    fetchData();
  }, [currentUser]);

  const fetchData = async () => {
    if (!currentUser?.id) return;
    try {
      setIsLoading(true);
      const [friendsList, users] = await Promise.all([
        friendService.getFriends(currentUser.id),
        userService.getAllUsers(),
      ]);
      setFriends(friendsList);
      setAllUsers(users.filter((u) => u.id !== currentUser.id));
    } catch {
      setError('Failed to load data.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFriend = async (friendUserId) => {
    try {
      await friendService.addFriend(currentUser.id, friendUserId);
      setSuccessMessage('Friend added!');
      fetchData();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch {
      setError('Failed to add friend.');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleRemoveFriend = async (friendshipId) => {
    try {
      await friendService.removeFriend(friendshipId);
      setFriends((prev) => prev.filter((f) => f.id !== friendshipId));
      setSuccessMessage('Friend removed.');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch {
      setError('Failed to remove friend.');
      setTimeout(() => setError(null), 3000);
    }
  };

  const friendUserIds = friends.map((f) =>
    f.userId === currentUser?.id ? f.friendId : f.userId
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg font-medium text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Friends</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
          <button onClick={() => setError(null)} className="float-right font-bold">&times;</button>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-900 border border-green-700 text-green-300 px-4 py-3 rounded mb-4">{successMessage}</div>
      )}

      <div className="mb-6">
        <div className="flex border-b border-gray-700">
          {['friends', 'discover'].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 font-medium capitalize ${
                activeTab === tab ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'friends' && (
        <div>
          {friends.length === 0 ? (
            <div className="bg-gray-800 border border-gray-700 text-gray-300 px-4 py-8 rounded-lg text-center">
              <h3 className="text-lg font-medium mb-2">No friends yet</h3>
              <p className="text-gray-400 mb-4">Start connecting with other users!</p>
              <button onClick={() => setActiveTab('discover')} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                Discover Users
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {friends.map((friendship) => {
                const friendId = friendship.userId === currentUser?.id ? friendship.friendId : friendship.userId;
                const friendUser = allUsers.find((u) => u.id === friendId);
                const name = friendUser
                  ? `${friendUser.firstName || ''} ${friendUser.lastName || ''}`.trim() || friendUser.email
                  : `User #${friendId}`;
                return (
                  <div key={friendship.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white text-lg mr-3">
                          {name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white font-medium">{name}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Link to={`/messages?user=${friendId}`} className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                          Message
                        </Link>
                        <button onClick={() => handleRemoveFriend(friendship.id)} className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'discover' && (
        <div>
          {allUsers.length === 0 ? (
            <div className="bg-gray-800 border border-gray-700 text-gray-300 px-4 py-8 rounded-lg text-center">
              <p className="text-gray-400">No other users to discover.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allUsers.map((user) => {
                const firstName = user.firstName || user.first_name || '';
                const lastName = user.lastName || user.last_name || '';
                const isFriend = friendUserIds.includes(user.id);
                return (
                  <div key={user.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white text-lg mr-3">
                          {firstName ? firstName.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div>
                          <p className="text-white font-medium">{firstName} {lastName}</p>
                          <p className="text-gray-400 text-sm">{user.email}</p>
                        </div>
                      </div>
                      {isFriend ? (
                        <span className="px-3 py-1 bg-green-900 text-green-300 rounded text-sm">Friends</span>
                      ) : (
                        <button onClick={() => handleAddFriend(user.id)} className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                          Add Friend
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FriendsPage;
