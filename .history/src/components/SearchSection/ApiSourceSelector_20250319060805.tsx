import { Library, BookOpen } from 'lucide-react';
import { useSearch } from '../../contexts/SearchContext';

interface ApiSourceSelectorProps {
  className?: string;
}

export function ApiSourceSelector({ className = '' }: ApiSourceSelectorProps) {
  const { apiSource, setApiSource } = useSearch();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={() => setApiSource('googleBooks')}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
          apiSource === 'googleBooks'
            ? 'bg-purple-600 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-dark-200 dark:text-gray-300 dark:hover:bg-dark-100'
        }`}
        aria-label="Use Google Books API"
      >
        <BookOpen className="w-4 h-4" />
        <span>Google Books</span>
      </button>
      <button
        onClick={() => setApiSource('openLibrary')}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
          apiSource === 'openLibrary'
            ? 'bg-purple-600 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-dark-200 dark:text-gray-300 dark:hover:bg-dark-100'
        }`}
        aria-label="Use Open Library API"
      >
        <Library className="w-4 h-4" />
        <span>Open Library</span>
      </button>
    </div>
  );
}