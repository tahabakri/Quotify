import { FiHeart, FiShare2, FiBookmark } from 'react-icons/fi';
import type { Quote } from '../../types';
import { QuoteCardStyleProps } from './index';

export interface QuoteCardProps extends QuoteCardStyleProps {
  quote: Quote;
  onLike?: () => void;
  onShare?: () => void;
  onSave?: () => void;
  liked?: boolean;
  saved?: boolean;
}

export function QuoteCard({
  quote,
  className = '',
  variant = 'default',
  interactive = true,
  theme = {},
  onLike,
  onShare,
  onSave,
  liked = false,
  saved = false
}: QuoteCardProps) {
  const cardStyles = {
    backgroundColor: theme.backgroundColor || 'transparent',
    color: theme.textColor || 'currentColor',
  };

  const variantClasses = {
    default: 'p-6 space-y-4',
    compact: 'p-4 space-y-3',
    featured: 'p-8 space-y-6'
  };

  const buttonClasses = interactive 
    ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700' 
    : 'cursor-default';

  return (
    <div 
      className={`
        bg-white dark:bg-gray-800
        rounded-lg shadow-md
        ${variantClasses[variant]}
        ${className}
      `}
      style={cardStyles}
    >
      {/* Quote content */}
      <blockquote>
        <p className={`
          ${variant === 'featured' ? 'text-xl' : 'text-lg'}
          font-medium leading-relaxed
        `}>
          "{quote.content}"
        </p>
      </blockquote>

      {/* Author and metadata */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {quote.author.imageUrl ? (
            <img 
              src={quote.author.imageUrl} 
              alt={quote.author.name}
              className={`
                rounded-full object-cover
                ${variant === 'compact' ? 'w-8 h-8' : 'w-10 h-10'}
              `}
            />
          ) : (
            <div className={`
              rounded-full bg-gray-200 dark:bg-gray-700
              ${variant === 'compact' ? 'w-8 h-8' : 'w-10 h-10'}
            `} />
          )}
          <div>
            <p className="font-medium">
              {quote.author.name}
            </p>
            {quote.book && variant !== 'compact' && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {quote.book.title}
              </p>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex space-x-2">
          <button
            onClick={interactive ? onLike : undefined}
            className={`
              p-2 rounded-lg transition-colors
              ${liked 
                ? 'text-red-500 bg-red-50 dark:bg-red-900/20' 
                : 'text-gray-500 dark:text-gray-400'}
              ${buttonClasses}
            `}
            aria-label={liked ? "Unlike quote" : "Like quote"}
            disabled={!interactive}
          >
            <FiHeart 
              className={liked ? 'fill-current' : ''} 
              style={{ color: liked ? theme.accentColor : undefined }}
            />
          </button>
          <button
            onClick={interactive ? onShare : undefined}
            className={`
              p-2 rounded-lg transition-colors
              text-gray-500 dark:text-gray-400
              ${buttonClasses}
            `}
            aria-label="Share quote"
            disabled={!interactive}
          >
            <FiShare2 />
          </button>
          <button
            onClick={interactive ? onSave : undefined}
            className={`
              p-2 rounded-lg transition-colors
              ${saved 
                ? 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                : 'text-gray-500 dark:text-gray-400'}
              ${buttonClasses}
            `}
            aria-label={saved ? "Remove from saved" : "Save quote"}
            disabled={!interactive}
          >
            <FiBookmark 
              className={saved ? 'fill-current' : ''} 
              style={{ color: saved ? theme.accentColor : undefined }}
            />
          </button>
        </div>
      </div>
    </div>
  );
}