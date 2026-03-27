import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import UserCard from "../components/UserCard";
import userService from "../services/userService";
import friendRequestService from "../services/friendRequestService";
import { useAuth } from "../hooks/useAuth";

const Home = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const usersData = await userService.getAllUsers();
        const filteredUsers = Array.isArray(usersData)
          ? usersData.filter((user) => user.id !== currentUser?.id)
          : [];
        setUsers(filteredUsers);

        try {
          const requests = await friendRequestService.getAllRequests();
          setFriendRequests(requests);
        } catch {
          setFriendRequests([]);
        }
      } catch {
        setError("Failed to load content. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, currentUser?.id]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          Welcome to YouShare
        </h1>
        <p className="text-xl text-gray-400 mb-8 max-w-2xl">
          A platform for YouCode students to share knowledge, ask questions, and
          connect with peers.
        </p>
        <div className="flex space-x-4">
          <Link
            to="/login"
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-6 py-3 bg-gray-700 text-white font-medium rounded-lg border border-gray-600 hover:bg-gray-600 transition-colors"
          >
            Register
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg font-medium text-white">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="bg-blue-600 text-white rounded-lg p-8 mb-8">
        <h1 className="text-3xl font-bold mb-4">
          Welcome back,{" "}
          {currentUser?.firstName || currentUser?.first_name || "User"}!
        </h1>
        <p className="text-lg mb-6">
          Connect with other students, share knowledge, and collaborate.
        </p>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <Link
            to="/articles"
            className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100 transition-colors text-center"
          >
            View Articles
          </Link>
          <Link
            to="/questions"
            className="px-6 py-3 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors text-center"
          >
            View Questions
          </Link>
          <Link
            to="/messages"
            className="px-6 py-3 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors text-center"
          >
            Messages
          </Link>
          <Link
            to="/friends"
            className="px-6 py-3 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors text-center"
          >
            Friends
          </Link>
        </div>
      </div>

      {friendRequests.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Pending Friend Requests
          </h2>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <p className="text-gray-300">
              You have {friendRequests.length} pending friend request(s).{" "}
              <Link to="/friends" className="text-blue-400 hover:text-blue-300">
                View all
              </Link>
            </p>
          </div>
        </div>
      )}

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Connect with Users</h2>
        </div>
        {Array.isArray(users) && users.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {users.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        ) : (
          <div className="bg-gray-800 p-6 text-center text-gray-400 rounded-lg border border-gray-700">
            No other users available to connect with
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
