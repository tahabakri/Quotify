import { FiHeart, FiShare2, FiBookmark, FiMoreHorizontal } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { TrendingQuote } from '../../types/quote';

interface QuoteCardProps {
  quote: TrendingQuote;
  onLike?: () => void;
  onShare?: () => void;
  onSave?: () => void;
}

export function QuoteCard({ quote, onLike, onShare, onSave }: QuoteCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
      {/* Quote Content */}
      <Link to={`/quote/${quote.id}`} className="block mb-4">
        <blockquote className="text-lg text-gray-800 dark:text-gray-200">
          "{quote.content}"
        </blockquote>
      </Link>

      {/* Book and Author Info */}
      <div className="flex items-center gap-4 mb-4">
        {quote.book.coverUrl && (
          <Link to={`/quote/${quote.id}`}>
            <img
              src={quote.book.coverUrl}
              alt={quote.book.title}
              className="w-12 h-16 object-cover rounded"
            />
          </Link>
        )}
        <div>
          <Link 
            to={`/quote/${quote.id}`}
            className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
          >
            {quote.book.title}
          </Link>
          <Link 
            to={`/author/${quote.authorId}`}
            className="block text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
          >
            {quote.author.name}
          </Link>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-4">
          <button
            onClick={onLike}
            className="flex items-center gap-1 hover:text-red-500 transition-colors"
            aria-label="Like quote"
          >
            <FiHeart className={quote.likes > 0 ? 'fill-current text-red-500' : ''} />
            <span>{quote.likes}</span>
          </button>
          <button
            onClick={onShare}
            className="flex items-center gap-1 hover:text-blue-500 transition-colors"
            aria-label="Share quote"
          >
            <FiShare2 />
            <span>Share</span>
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onSave}
            className="hover:text-blue-500 transition-colors"
            aria-label="Save to collection"
          >
            <FiBookmark />
          </button>
          <button
            className="hover:text-blue-500 transition-colors"
            aria-label="More options"
          >
            <FiMoreHorizontal />
          </button>
        </div>
      </div>
    </div>
  );
}