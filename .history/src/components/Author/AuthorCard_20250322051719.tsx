import { Link } from 'react-router-dom';

interface AuthorCardProps {
  id: string;
  name: string;
  imageUrl?: string;
  quotesCount: number;
  booksCount: number;
}

export const AuthorCard = ({ id, name, imageUrl, quotesCount, booksCount }: AuthorCardProps) => {
  return (
    <Link 
      to={`/authors/${id}`}
      className="group block p-4 rounded-lg border border-gray-200 dark:border-gray-700 
                bg-white dark:bg-gray-800 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl text-gray-400 dark:text-gray-500">
              {name.charAt(0)}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
            {name}
          </h3>
          
          <div className="mt-1 flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {quotesCount} quotes
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {booksCount} books
            </span>
          </div>
        </div>

        <div className="text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400">
          {/* Placeholder for chevron icon */}
          <span className="text-xl">→</span>
        </div>
      </div>
    </Link>
  );
};

// Loading skeleton for AuthorCard
export const AuthorCardSkeleton = () => {
  return (
    <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="flex items-center gap-4 animate-pulse">
        <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700" />
        
        <div className="flex-1">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2" />
          <div className="flex items-center gap-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
          </div>
        </div>
      </div>
    </div>
  );
};