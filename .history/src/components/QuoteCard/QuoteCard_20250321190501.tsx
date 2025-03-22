import { FiHeart, FiShare2, FiBookmark } from 'react-icons/fi';
import type { Quote, BaseProps } from '../../types';
import { NoResults } from '../common';

export interface QuoteCardProps extends BaseProps {
  quote?: Quote;
  onLike?: () => void;
  onShare?: () => void;
  onSave?: () => void;
  liked?: boolean;
  saved?: boolean;
  loading?: boolean;
}

export function QuoteCard({
  quote,
  className = '',
  onLike,
  onShare,
  onSave,
  liked = false,
  saved = false,
  loading = false
}: QuoteCardProps) {
  if (!quote && !loading) {
    return (
      <NoResults 
        type="empty" 
        message="Quote not found"
        className={className}
      />
    );
  }

  if (!quote) {
    return null;
  }

  return (
    <div className={`
      bg-white dark:bg-gray-800
      rounded-lg shadow-md
      p-6 space-y-4
      ${className}
    `}>
      {/* Quote content */}
      <blockquote className="text-gray-900 dark:text-white">
        <p className="text-lg font-medium leading-relaxed">
          "{quote.content}"
        </p>
      </blockquote>

      {/* Author and metadata */}
      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center space-x-3">
          {quote.author.imageUrl ? (
            <img 
              src={quote.author.imageUrl} 
              alt={quote.author.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
          )}
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {quote.author.name}
            </p>
            {quote.book && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {quote.book.title}
              </p>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex space-x-2">
          <button
            onClick={onLike}
            className={`
              p-2 rounded-lg transition-colors
              ${liked 
                ? 'text-red-500 bg-red-50 dark:bg-red-900/20' 
                : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'}
            `}
            aria-label={liked ? "Unlike quote" : "Like quote"}
          >
            <FiHeart className={liked ? 'fill-current' : ''} />
          </button>
          <button
            onClick={onShare}
            className="
              p-2 rounded-lg transition-colors
              text-gray-500 hover:bg-gray-100 
              dark:text-gray-400 dark:hover:bg-gray-700
            "
            aria-label="Share quote"
          >
            <FiShare2 />
          </button>
          <button
            onClick={onSave}
            className={`
              p-2 rounded-lg transition-colors
              ${saved 
                ? 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'}
            `}
            aria-label={saved ? "Remove from saved" : "Save quote"}
          >
            <FiBookmark className={saved ? 'fill-current' : ''} />
          </button>
        </div>
      </div>
    </div>
  );
}