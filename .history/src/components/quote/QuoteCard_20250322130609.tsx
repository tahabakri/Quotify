import { Link } from 'react-router-dom';

interface QuoteCardProps {
  content: string;
  author: {
    id: string;
    name: string;
  };
  book?: {
    id: string;
    title: string;
  };
  isQuoteOfTheDay?: boolean;
}

export const QuoteCard = ({ content, author, book, isQuoteOfTheDay }: QuoteCardProps) => {
  return (
    <div 
      className={`
        p-6 rounded-lg shadow-sm border bg-white dark:bg-gray-800 
        ${isQuoteOfTheDay 
          ? 'border-blue-200 dark:border-blue-800' 
          : 'border-gray-200 dark:border-gray-700'}
      `}
    >
      {isQuoteOfTheDay && (
        <div className="flex items-center gap-2 mb-4 text-blue-600 dark:text-blue-400">
          <span className="text-lg">⭐</span>
          <span className="text-sm font-medium">Quote of the Day</span>
        </div>
      )}
      
      <blockquote className="space-y-4">
        <p className="text-lg text-gray-800 dark:text-gray-200">
          "{content}"
        </p>
        
        <footer className="flex items-start justify-between">
          <div className="flex-1">
            <Link 
              to={`/authors/${author.id}`}
              className="block text-base font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
            >
              {author.name}
            </Link>
            {book && (
              <Link 
                to={`/books/${book.id}`}
                className="block mt-1 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              >
                {book.title}
              </Link>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
              aria-label="Like quote"
            >
              {/* Placeholder for heart icon */}
              <span>❤️</span>
            </button>
            <button 
              className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
              aria-label="Share quote"
            >
              {/* Placeholder for share icon */}
              <span>↗️</span>
            </button>
          </div>
        </footer>
      </blockquote>
    </div>
  );
};

// Loading skeleton for QuoteCard
export const QuoteCardSkeleton = () => {
  return (
    <div className="p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="space-y-4 animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
        <div className="flex justify-between items-center pt-4">
          <div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32" />
          </div>
          <div className="flex gap-2">
            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};