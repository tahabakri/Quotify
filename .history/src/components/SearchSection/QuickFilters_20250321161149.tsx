import { useSearch } from '../../contexts/useSearch';

interface QuickFiltersProps {
  className?: string;
}

const filters = [
  { id: 'trending', label: 'Trending' },
  { id: 'recent', label: 'Recent' },
  { id: 'popular', label: 'Popular' },
  { id: 'recommended', label: 'For You' },
] as const;

export function QuickFilters({ className = '' }: QuickFiltersProps) {
  const { filters: activeFilters, setFilters } = useSearch();
  const activeQuickFilter = activeFilters.quickFilter || 'trending';

  const handleFilterSelect = (filterId: string) => {
    setFilters({
      ...activeFilters,
      quickFilter: filterId
    });
  };

  return (
    <div className={className}>
      {filters.map(filter => (
        <button
          key={filter.id}
          onClick={() => handleFilterSelect(filter.id)}
          className={`w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeQuickFilter === filter.id
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400'
              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
          }`}
          aria-pressed={activeQuickFilter === filter.id ? 'true' : 'false'}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}