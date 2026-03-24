import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import questionService from '../services/questionService';
import { useAuth } from '../hooks/useAuth';

const QuestionCard = ({ question }) => {
  const { isAuthenticated } = useAuth();
  const [votesCount, setVotesCount] = useState(question.votes || 0);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      const checkVoteStatus = async () => {
        try {
          const response = await questionService.checkUserVoted(question.id);
          setHasVoted(response.liked);
          setVotesCount(response.count || question.votes || 0);
        } catch {
          /* ignore */
        }
      };
      checkVoteStatus();
    }
  }, [question.id, isAuthenticated]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleVote = async () => {
    if (!isAuthenticated) return;
    try {
      await questionService.toggleVote(question.id);
      const response = await questionService.checkUserVoted(question.id);
      setHasVoted(response.liked);
      setVotesCount(response.count);
    } catch (error) {
      console.error('Error toggling vote:', error);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden mb-4 hover:shadow-lg transition-shadow duration-300 border border-gray-700">
      <div className="p-4">
        <div className="flex items-start">
          <div className="mr-4 flex flex-col items-center">
            <button
              onClick={handleVote}
              className={`flex flex-col items-center p-2 rounded-lg ${hasVoted ? 'bg-blue-900 text-blue-400' : 'text-gray-400 hover:bg-gray-700'}`}
              disabled={!isAuthenticated}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
              <span className="text-sm font-medium">{votesCount}</span>
            </button>
          </div>
          <div className="flex-1">
            <Link to={`/questions/${question.id}`}>
              <h3 className="text-lg font-medium text-blue-400 hover:text-blue-300 mb-2">{question.title}</h3>
            </Link>
            <div className="text-sm text-gray-400 mb-3 line-clamp-2">{question.description}</div>
            <div className="flex items-center text-sm text-gray-400">
              <span>Author #{question.authorId}</span>
              <span className="mx-2">&#8226;</span>
              <span>{formatDate(question.date)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
