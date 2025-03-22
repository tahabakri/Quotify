import { useState } from 'react';

type FilterCategory = 'trending' | 'recent' | 'popular' | 'forYou';

interface QuickFilter {
  id: string;
  label: string;
  category: FilterCategory;
  emoji?: string;
}

const FILTERS: QuickFilter[] = [
  { id: 'trending', label: 'Trending', category: 'trending', emoji: '🔥' },
  { id: 'recent', label: 'Recent', category: 'recent', emoji: '⭐' },
  { id: 'popular', label: 'Popular', category: 'popular', emoji: '📈' },
  { id: 'forYou', label: 'For You', category: 'forYou', emoji: '✨' }
];

export const QuickFilters = () => {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('trending');

  return (
    <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
      {FILTERS.map((filter) => (
        <button
          key={filter.id}
          onClick={() => setActiveFilter(filter.category)}
          className={`
            px-4 py-2 rounded-full text-sm font-medium transition-all
            ${
              activeFilter === filter.category
              ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }
          `}
        >
          <span className="flex items-center gap-1.5">
            {filter.emoji && <span>{filter.emoji}</span>}
            {filter.label}
          </span>
        </button>
      ))}
    </div>
  );
};