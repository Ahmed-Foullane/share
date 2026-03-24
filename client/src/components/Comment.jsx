import { useState, useEffect } from 'react';
import commentService from '../services/commentService';
import { useAuth } from '../hooks/useAuth';

const Comment = ({ comment, questionOwnerId, questionId, onCommentUpdate, onCommentDelete }) => {
  const { currentUser, isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(comment?.content || '');
  const [votes, setVotes] = useState(comment?.votes || 0);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    if (isAuthenticated && comment?.id) {
      const checkVoteStatus = async () => {
        try {
          const response = await commentService.checkUserVoted(comment.id);
          setHasVoted(response.liked);
          setVotes(response.count || comment?.votes || 0);
        } catch {
          /* ignore */
        }
      };
      checkVoteStatus();
    }
  }, [comment?.id, isAuthenticated]);

  const isOwner = currentUser?.studentId && String(currentUser.studentId) === String(comment?.authorId);
  const canAccept = currentUser?.studentId && String(currentUser.studentId) === String(questionOwnerId);
  const isAccepted = comment?.isAccepted || comment?.is_accepted || false;

  const handleVote = async () => {
    if (!isAuthenticated || !comment?.id) return;

    const newVotedState = !hasVoted;
    const newVotesCount = newVotedState ? votes + 1 : votes - 1;

    setHasVoted(newVotedState);
    setVotes(newVotesCount);

    try {
      await commentService.toggleVote(comment.id);
      const response = await commentService.checkUserVoted(comment.id);
      setHasVoted(response.liked);
      setVotes(response.count);
    } catch {
      setHasVoted(!newVotedState);
      setVotes(newVotedState ? newVotesCount - 1 : newVotesCount + 1);
    }
  };

  const handleAccept = async () => {
    if (!comment?.id) return;
    try {
      const response = await commentService.markAsAccepted(comment.id);
      onCommentUpdate(response);
    } catch (error) {
      console.error('Error toggling accepted status:', error);
    }
  };

  const handleSave = async () => {
    if (!comment?.id) return;
    try {
      await commentService.updateComment(comment.id, content, questionId);
      setIsEditing(false);
      onCommentUpdate({ ...comment, content });
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleDelete = async () => {
    if (!comment?.id) return;
    try {
      await commentService.deleteComment(comment.id);
      onCommentDelete(comment.id);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  if (!comment) return null;

  return (
    <div className={`border-b border-gray-700 py-4 ${isAccepted ? 'bg-green-900 bg-opacity-20 rounded-lg px-4' : ''}`}>
      <div className="flex">
        <div className="flex flex-col items-center mr-4">
          <button
            onClick={handleVote}
            className={`p-1 rounded ${hasVoted ? 'text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
            disabled={!isAuthenticated}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <span className="text-sm font-semibold text-white">{votes}</span>
          {isAccepted && (
            <div className="mt-2 text-green-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </div>
        <div className="flex-1">
          {isEditing ? (
            <div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
              <div className="mt-2 flex space-x-2">
                <button onClick={handleSave} className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save</button>
                <button onClick={() => { setContent(comment?.content || ''); setIsEditing(false); }} className="px-3 py-1 bg-gray-600 text-gray-200 rounded-md hover:bg-gray-500">Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <div className="text-gray-300 mb-2">{content}</div>
              <div className="flex flex-wrap items-center text-sm text-gray-400">
                <div className="mr-4">Author ID: {comment.authorId}</div>
                {isOwner && (
                  <div className="flex space-x-2">
                    <button onClick={() => setIsEditing(true)} className="text-blue-400 hover:text-blue-300">Edit</button>
                    <button onClick={handleDelete} className="text-red-400 hover:text-red-300">Delete</button>
                  </div>
                )}
                {canAccept && (
                  <button
                    onClick={handleAccept}
                    className={`ml-auto px-3 py-1 ${isAccepted ? 'bg-red-900 text-red-300 hover:bg-red-800' : 'bg-green-900 text-green-300 hover:bg-green-800'} rounded-md flex items-center font-medium`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {isAccepted ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      )}
                    </svg>
                    {isAccepted ? 'Unmark as Answer' : 'Mark as Answer'}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Comment;
