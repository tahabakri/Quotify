import { useSearch } from '../../contexts/useSearch';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

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
    <div className={cn("flex gap-2", className)}>
      {filters.map(filter => (
        <Button
          key={filter.id}
          onClick={() => handleFilterSelect(filter.id)}
          variant={activeQuickFilter === filter.id ? "secondary" : "ghost"}
          className="flex-1"
          aria-pressed={activeQuickFilter === filter.id}
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
}