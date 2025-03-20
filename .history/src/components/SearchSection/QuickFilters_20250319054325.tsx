import { TrendingUp, Clock, BookOpen } from 'lucide-react';

interface QuickFilter {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface QuickFiltersProps {
  onFilterSelect: (filterId: string) => void;
  selectedFilter: string;
  className?: string;
}

const filters: QuickFilter[] = [
  {
    id: 'trending',
    label: 'Trending',
    icon: <TrendingUp className="w-4 h-4" />,
  },
  {
    id: 'latest',
    label: 'Latest',
    icon: <Clock className="w-4 h-4" />,
  },
  {
    id: 'genre',
    label: 'By Genre',
    icon: <BookOpen className="w-4 h-4" />,
  },
];

export function QuickFilters({ onFilterSelect, selectedFilter, className = '' }: QuickFiltersProps) {
  return (
    <div className={`flex gap-4 ${className}`}>
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterSelect(filter.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            selectedFilter === filter.id
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-dark-200 dark:text-gray-300 dark:hover:bg-dark-100'
          }`}
        >
          {filter.icon}
          {filter.label}
        </button>
      ))}
    </div>
  );
}