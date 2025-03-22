import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ErrorMessage } from '../components/common/ErrorMessage';

interface Comment {
  id: string;
  text: string;
  user: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  createdAt: string;
}

interface Quote {
  id: string;
  text: string;
  author: {
    id: string;
    name: string;
    imageUrl?: string;
  };
  book?: {
    id: string;
    title: string;
    coverUrl?: string;
  };
  likes: number;
  isLiked: boolean;
  comments: Comment[];
}

const QuoteDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        setLoading(true);
        setError(null);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock data
        setQuote({
          id: id || '1',
          text: "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.",
          author: {
            id: '1',
            name: 'Albert Einstein',
            imageUrl: '/authors/einstein.jpg'
          },
          book: {
            id: '1',
            title: 'The World As I See It',
            coverUrl: '/books/world-as-i-see-it.jpg'
          },
          likes: 1234,
          isLiked: false,
          comments: [
            {
              id: '1',
              text: 'This quote really resonates with me!',
              user: {
                id: '1',
                name: 'John Doe',
                avatarUrl: '/users/john.jpg'
              },
              createdAt: '2025-03-21T12:00:00Z'
            }
          ]
        });

      } catch (err) {
        setError('Failed to load quote details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchQuote();
    }
  }, [id]);

  const handleLike = () => {
    if (quote) {
      setQuote(prev => prev ? {
        ...prev,
        likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1,
        isLiked: !prev.isLiked
      } : null);
    }
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    navigator.clipboard.writeText(window.location.href);
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    // Add new comment to the list
    if (quote) {
      const newComment: Comment = {
        id: Date.now().toString(),
        text: comment,
        user: {
          id: 'current-user',
          name: 'Current User',
          avatarUrl: '/users/default.jpg'
        },
        createdAt: new Date().toISOString()
      };

      setQuote(prev => prev ? {
        ...prev,
        comments: [newComment, ...prev.comments]
      } : null);

      setComment('');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8 animate-pulse">
          <div className="max-w-4xl mx-auto">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4" />
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-8" />
            <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded mb-8" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !quote) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <ErrorMessage message={error || 'Quote not found'} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Quote */}
          <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="p-8 md:p-12">
              <blockquote className="text-2xl md:text-3xl font-serif text-gray-900 dark:text-white leading-relaxed mb-8">
                "{quote.text}"
              </blockquote>

              <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-6">
                <div className="flex items-center">
                  <Link 
                    to={`/authors/${quote.author.id}`}
                    className="flex items-center group"
                  >
                    {quote.author.imageUrl && (
                      <img
                        src={quote.author.imageUrl}
                        alt={quote.author.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {quote.author.name}
                      </h3>
                      {quote.book && (
                        <Link
                          to={`/books/${quote.book.id}`}
                          className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                        >
                          {quote.book.title}
                        </Link>
                      )}
                    </div>
                  </Link>
                </div>

                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleLike}
                    className={`flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 ${
                      quote.isLiked ? 'text-blue-600 dark:text-blue-400' : ''
                    }`}
                    aria-label={quote.isLiked ? 'Unlike quote' : 'Like quote'}
                  >
                    <span>❤️</span>
                    <span>{quote.likes}</span>
                  </button>
                  <button
                    onClick={handleShare}
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                    aria-label="Share quote"
                  >
                    <span>↗️</span>
                  </button>
                </div>
              </div>
            </div>
          </article>

          {/* Comments Section */}
          <section className="mt-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Discussion
            </h2>

            {/* Comment Form */}
            <form onSubmit={handleComment} className="mb-8">
              <label htmlFor="comment" className="sr-only">
                Add a comment
              </label>
              <textarea
                id="comment"
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                placeholder="Share your thoughts..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <div className="mt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  disabled={!comment.trim()}
                >
                  Post Comment
                </button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-6">
              {quote.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm"
                >
                  <div className="flex items-start space-x-4">
                    {comment.user.avatarUrl && (
                      <img
                        src={comment.user.avatarUrl}
                        alt={comment.user.name}
                        className="w-10 h-10 rounded-full"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          {comment.user.name}
                        </h4>
                        <time className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </time>
                      </div>
                      <p className="mt-1 text-gray-600 dark:text-gray-300">
                        {comment.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default QuoteDetailPage;