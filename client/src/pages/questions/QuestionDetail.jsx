import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import questionService from '../../services/questionService';
import commentService from '../../services/commentService';
import Comment from '../../components/Comment';
import { useAuth } from '../../hooks/useAuth';

const QuestionDetail = () => {
  const { id } = useParams();
  const { currentUser, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [question, setQuestion] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [votesCount, setVotesCount] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    const fetchQuestionData = async () => {
      try {
        setIsLoading(true);

        const questionData = await questionService.getQuestionById(id);
        setQuestion(questionData);
        setVotesCount(questionData.votes || 0);

        if (isAuthenticated) {
          try {
            const voteStatus = await questionService.checkUserVoted(id);
            setHasVoted(voteStatus.liked);
            setVotesCount(voteStatus.count || questionData.votes || 0);
          } catch {
            /* ignore */
          }
        }

        try {
          const commentsData = await commentService.getCommentsByQuestion(id);
          setComments(Array.isArray(commentsData) ? commentsData : []);
        } catch {
          setComments([]);
        }
      } catch (err) {
        console.error('Error fetching question:', err);
        setError('Failed to load the question. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestionData();
  }, [id, isAuthenticated]);

  const handleVote = async () => {
    if (!isAuthenticated) return;

    const newVotedState = !hasVoted;
    const newVotesCount = newVotedState ? votesCount + 1 : votesCount - 1;

    setHasVoted(newVotedState);
    setVotesCount(newVotesCount);

    try {
      await questionService.toggleVote(id);
      const voteStatus = await questionService.checkUserVoted(id);
      setHasVoted(voteStatus.liked);
      setVotesCount(voteStatus.count);
    } catch {
      setHasVoted(!newVotedState);
      setVotesCount(newVotedState ? newVotesCount - 1 : newVotesCount + 1);
    }
  };

  const handleDelete = async () => {
    try {
      await questionService.deleteQuestion(id);
      navigate('/questions');
    } catch {
      setError('Failed to delete the question. Please try again later.');
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !isAuthenticated) return;

    try {
      setIsSubmittingComment(true);
      const newCommentData = await commentService.createComment(id, newComment);
      setComments((prev) => [...prev, newCommentData]);
      setNewComment('');
    } catch {
      setError('Failed to add your comment. Please try again later.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleUpdateComment = (updatedComment) => {
    if (updatedComment.isAccepted) {
      setComments((prev) =>
        prev.map((c) => (c.id === updatedComment.id ? updatedComment : { ...c, isAccepted: false }))
      );
    } else {
      setComments((prev) => prev.map((c) => (c.id === updatedComment.id ? updatedComment : c)));
    }
  };

  const handleDeleteComment = (commentId) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

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

  if (!question) {
    return <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-4">Question not found.</div>;
  }

  const isOwner = currentUser?.studentId && String(currentUser.studentId) === String(question.authorId);
  const canEdit = isOwner || isAdmin;

  return (
    <div>
      <div className="mb-6">
        <Link to="/questions" className="text-blue-400 hover:text-blue-300 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Questions
        </Link>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-6 border border-gray-700">
        <div className="p-6">
          <div className="flex">
            <div className="mr-6 flex flex-col items-center">
              <button
                onClick={handleVote}
                className={`p-2 rounded-lg ${hasVoted ? 'bg-blue-900 text-blue-400' : 'text-gray-400 hover:bg-gray-700'}`}
                disabled={!isAuthenticated}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <span className="text-xl font-semibold my-2 text-white">{votesCount}</span>
              <div className="text-sm text-gray-400">
                {comments.length} {comments.length === 1 ? 'answer' : 'answers'}
              </div>
            </div>

            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white mb-4">{question.title}</h1>
              <div className="prose prose-invert max-w-none mb-6 text-gray-300" dangerouslySetInnerHTML={{ __html: question.description }} />

              <div className="flex items-center justify-between text-sm text-gray-400 border-t border-gray-700 pt-4">
                <div className="flex items-center">
                  <span>Author ID: {question.authorId}</span>
                  <span className="mx-2">&#8226;</span>
                  <span>Asked on {formatDate(question.date)}</span>
                </div>

                {canEdit && (
                  <div className="flex space-x-2">
                    <Link to={`/questions/edit/${question.id}`} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium">
                      Edit
                    </Link>
                    <button onClick={() => setShowDeleteModal(true)} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium">
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-6 border border-gray-700">
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-6">
            {comments.length} {comments.length === 1 ? 'Answer' : 'Answers'}
          </h2>

          {comments.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <p className="text-lg mb-2">No answers yet</p>
              <p className="mb-4">Be the first to answer this question!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {comments.map((comment) => (
                <Comment
                  key={comment.id}
                  comment={comment}
                  questionOwnerId={question.authorId}
                  questionId={question.id}
                  onCommentUpdate={handleUpdateComment}
                  onCommentDelete={handleDeleteComment}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {isAuthenticated ? (
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700">
          <div className="p-6">
            <h2 className="text-xl font-bold text-white mb-4">Your Answer</h2>
            <form onSubmit={handleSubmitComment}>
              <div className="mb-4">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={6}
                  placeholder="Write your answer here..."
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                disabled={isSubmittingComment}
              >
                {isSubmittingComment ? 'Posting...' : 'Post Your Answer'}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="bg-gray-800 border border-gray-700 text-gray-300 p-4 rounded-lg text-center">
          <p className="mb-2">You need to be logged in to answer this question.</p>
          <div className="flex justify-center space-x-2">
            <Link to="/login" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Login</Link>
            <Link to="/register" className="px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-md hover:bg-gray-600">Register</Link>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-96 max-w-full border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">Delete Question</h3>
            <p className="mb-6 text-gray-300">Are you sure you want to delete this question? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionDetail;
