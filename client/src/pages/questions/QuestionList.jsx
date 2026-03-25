import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import QuestionCard from '../../components/QuestionCard';
import SearchBar from '../../components/SearchBar';
import questionService from '../../services/questionService';
import tagService from '../../services/tagService';

const QuestionList = () => {
  const [searchParams] = useSearchParams();
  const [questions, setQuestions] = useState([]);
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const tagId = searchParams.get('tag');
  const query = searchParams.get('query');

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tagsRes = await tagService.getAllTags();
        setTags(Array.isArray(tagsRes) ? tagsRes : []);
      } catch {
        setTags([]);
      }
    };
    fetchTags();
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        let data;

        if (query) {
          data = await questionService.searchQuestions(query);
        } else {
          data = await questionService.getAllQuestions();
        }

        setQuestions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError('Failed to load questions. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [tagId, query]);

  const getTitle = () => {
    if (query) return `Search Results for "${query}"`;
    if (tagId) {
      if (Array.isArray(tags)) {
        const tag = tags.find((t) => t.id === parseInt(tagId));
        return tag ? `Questions tagged with ${tag.name}` : 'Questions by Tag';
      }
      return 'Questions by Tag';
    }
    return 'All Questions';
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-64 shrink-0">
        <div className="bg-gray-800 rounded-lg shadow p-4 mb-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-3">Search</h3>
          <SearchBar type="questions" placeholder="Search questions..." />
        </div>

        <div className="bg-gray-800 rounded-lg shadow p-4 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-3">Popular Tags</h3>
          <div className="flex flex-wrap gap-2">
            {Array.isArray(tags) && tags.length > 0 ? (
              tags.slice(0, 20).map((tag) => (
                <Link
                  key={tag.id}
                  to={`/questions?tag=${tag.id}`}
                  className={`text-sm px-3 py-1 rounded-full ${
                    tagId === tag.id.toString()
                      ? 'bg-blue-900 text-blue-300'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  #{tag.name}
                </Link>
              ))
            ) : (
              <span className="text-gray-500 text-sm">No tags available</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">{getTitle()}</h1>
          <Link
            to="/questions/create"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Ask Question
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-lg font-medium text-white">Loading...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
        ) : questions.length === 0 ? (
          <div className="bg-gray-800 border border-gray-700 text-gray-300 px-4 py-8 rounded-lg text-center">
            <h3 className="text-lg font-medium mb-2">No questions found</h3>
            <p className="text-gray-400 mb-4">
              {query ? `No questions match your search "${query}".` : 'No questions have been asked yet.'}
            </p>
            <Link to="/questions/create" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
              Ask the first question
            </Link>
          </div>
        ) : (
          <div className="space-y-4 mb-6">
            {questions.map((question) => (
              <QuestionCard key={question.id} question={question} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionList;
