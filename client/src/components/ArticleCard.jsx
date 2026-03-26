import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import articleService from '../services/articleService';
import { useAuth } from '../hooks/useAuth';

const ArticleCard = ({ article }) => {
  const { isAuthenticated } = useAuth();
  const [likesCount, setLikesCount] = useState(article.likes || 0);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      const checkLikeStatus = async () => {
        try {
          const response = await articleService.checkUserLiked(article.id);
          setHasLiked(response.liked);
          setLikesCount(response.count);
        } catch {
          /* ignore */
        }
      };
      checkLikeStatus();
    }
  }, [article.id, isAuthenticated]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleLike = async () => {
    if (!isAuthenticated) return;
    try {
      await articleService.toggleLike(article.id);
      const response = await articleService.checkUserLiked(article.id);
      setHasLiked(response.liked);
      setLikesCount(response.count);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-700">
      <div className="p-4">
        <Link to={`/articles/${article.id}`}>
          <h2 className="text-xl font-semibold text-white mb-2 hover:text-blue-400">{article.title}</h2>
        </Link>
        <div className="flex items-center text-sm text-gray-400 mb-3">
          <span>Author #{article.authorId}</span>
          <span className="mx-2">&#8226;</span>
          <span>{formatDate(article.date)}</span>
        </div>
        {article.categoryId && (
          <div className="mb-3">
            <Link
              to={`/articles?category=${article.categoryId}`}
              className="inline-block bg-blue-900 text-blue-300 text-xs px-2 py-1 rounded-full"
            >
              Category #{article.categoryId}
            </Link>
          </div>
        )}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handleLike}
            className={`flex items-center text-sm ${hasLiked ? 'text-blue-400' : 'text-gray-400'}`}
            disabled={!isAuthenticated}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill={hasLiked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>{likesCount} {likesCount === 1 ? 'like' : 'likes'}</span>
          </button>
          <Link to={`/articles/${article.id}`} className="text-sm text-blue-400 hover:text-blue-300">
            Read more &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
