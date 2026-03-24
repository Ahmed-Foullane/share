import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import articleService from '../../services/articleService';
import questionService from '../../services/questionService';
import ArticleCard from '../../components/ArticleCard';
import QuestionCard from '../../components/QuestionCard';

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('articles');
  const [userArticles, setUserArticles] = useState([]);
  const [userQuestions, setUserQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserContent = async () => {
      if (!currentUser?.studentId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const [articles, questions] = await Promise.all([
          articleService.getArticlesByAuthor(currentUser.studentId),
          questionService.getQuestionsByAuthor(currentUser.studentId),
        ]);

        setUserArticles(Array.isArray(articles) ? articles : []);
        setUserQuestions(Array.isArray(questions) ? questions : []);
      } catch (err) {
        console.error('Error fetching user content:', err);
        setError('Failed to load your content. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserContent();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="text-center py-10">
        <p className="text-lg mb-4 text-gray-300">You need to be logged in to view your profile.</p>
        <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Login</Link>
      </div>
    );
  }

  const firstName = currentUser.firstName || currentUser.first_name || '';
  const lastName = currentUser.lastName || currentUser.last_name || '';

  return (
    <div>
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8 border border-gray-700">
        <div className="flex flex-col md:flex-row items-center md:items-start">
          <div className="mb-6 md:mb-0 md:mr-8 text-center">
            <div className="w-32 h-32 rounded-full bg-blue-500 flex items-center justify-center text-white text-4xl mx-auto">
              {firstName ? firstName.charAt(0).toUpperCase() : '?'}
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold text-white mb-2">{firstName} {lastName}</h1>
            <p className="text-gray-400 mb-4">{currentUser.email}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-400">{userArticles.length}</div>
                <div className="text-gray-400">Articles</div>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-400">{userQuestions.length}</div>
                <div className="text-gray-400">Questions</div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
              <Link to="/articles/create" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-center">
                Create Article
              </Link>
              <Link to="/questions/create" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-center">
                Ask Question
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex border-b border-gray-700">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'articles' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('articles')}
          >
            Articles
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'questions' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('questions')}
          >
            Questions
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg font-medium text-white">Loading...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
      ) : activeTab === 'articles' ? (
        userArticles.length === 0 ? (
          <div className="bg-gray-800 border border-gray-700 text-gray-300 px-4 py-8 rounded-lg text-center">
            <h3 className="text-lg font-medium mb-2">No articles yet</h3>
            <p className="text-gray-400 mb-4">Share your knowledge by creating your first article!</p>
            <Link to="/articles/create" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
              Create Article
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )
      ) : userQuestions.length === 0 ? (
        <div className="bg-gray-800 border border-gray-700 text-gray-300 px-4 py-8 rounded-lg text-center">
          <h3 className="text-lg font-medium mb-2">No questions yet</h3>
          <p className="text-gray-400 mb-4">Got something to ask? Post your first question!</p>
          <Link to="/questions/create" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
            Ask Question
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {userQuestions.map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
