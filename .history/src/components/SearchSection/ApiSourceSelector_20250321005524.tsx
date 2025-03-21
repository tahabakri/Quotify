import { useSearch } from '../../contexts/useSearch';

interface ApiSourceSelectorProps {
  className?: string;
}

const sources = [
  { id: 'googleBooks', label: 'Google Books' },
  { id: 'openLibrary', label: 'Open Library' }
] as const;

export function ApiSourceSelector({ className = '' }: ApiSourceSelectorProps) {
  const { apiSource, setApiSource } = useSearch();

  return (
    <div className={className}>
      {sources.map(source => (
        <button
          key={source.id}
          onClick={() => setApiSource(source.id)}
          className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
            apiSource === source.id
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400'
              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
          }`}
          aria-pressed={apiSource === source.id}
        >
          {source.label}
        </button>
      ))}
    </div>
  );
}