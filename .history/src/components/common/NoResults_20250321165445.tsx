import { FiSearch, FiAlertCircle } from 'react-icons/fi';

interface NoResultsProps {
  message?: string;
  suggestion?: string;
  type?: 'search' | 'error' | 'empty';
  className?: string;
}

export function NoResults({
  message = 'No results found',
  suggestion = 'Try adjusting your search criteria',
  type = 'search',
  className = ''
}: NoResultsProps) {
  const icons = {
    search: FiSearch,
    error: FiAlertCircle,
    empty: FiAlertCircle
  };

  const Icon = icons[type];

  return (
    <div 
      className={`
        flex flex-col items-center justify-center p-8 text-center
        ${className}
      `}
    >
      <div className="mb-4">
        <Icon 
          className="w-12 h-12 text-gray-400 dark:text-gray-600" 
          aria-hidden="true"
        />
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        {message}
      </h3>
      {suggestion && (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {suggestion}
        </p>
      )}
    </div>
  );
}