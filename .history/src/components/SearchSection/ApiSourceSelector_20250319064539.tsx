import { Library, BookOpen, AlertCircle } from 'lucide-react';
import { useSearch } from '../../contexts/useSearch';

interface ApiSourceSelectorProps {
  className?: string;
}

export function ApiSourceSelector({ className = '' }: ApiSourceSelectorProps) {
  const { apiSource, setApiSource, error } = useSearch();

  const isGoogleBooksError = error?.includes('Google Books');
  const isOpenLibraryError = error?.includes('Open Library');

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={() => setApiSource('googleBooks')}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 relative ${
          apiSource === 'googleBooks'
            ? 'bg-purple-600 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-dark-200 dark:text-gray-300 dark:hover:bg-dark-100'
        } ${isGoogleBooksError ? 'opacity-50' : ''}`}
        aria-label="Use Google Books API"
        disabled={isGoogleBooksError}
      >
        <BookOpen className="w-4 h-4" />
        <span>Google Books</span>
        {isGoogleBooksError && (
          <div className="absolute -top-2 -right-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
          </div>
        )}
      </button>
      <button
        onClick={() => setApiSource('openLibrary')}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 relative ${
          apiSource === 'openLibrary'
            ? 'bg-purple-600 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-dark-200 dark:text-gray-300 dark:hover:bg-dark-100'
        } ${isOpenLibraryError ? 'opacity-50' : ''}`}
        aria-label="Use Open Library API"
        disabled={isOpenLibraryError}
      >
        <Library className="w-4 h-4" />
        <span>Open Library</span>
        {isOpenLibraryError && (
          <div className="absolute -top-2 -right-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
          </div>
        )}
      </button>
      {error && (
        <div className="text-xs text-red-500 dark:text-red-400 ml-2">
          {error}
        </div>
      )}
    </div>
  );
}