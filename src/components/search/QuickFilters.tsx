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
    <div className="flex items-center justify-center gap-3 mt-6 flex-wrap">
      {FILTERS.map((filter) => (
        <button
          key={filter.id}
          type="button"
          onClick={() => setActiveFilter(filter.category)}
          className={`
            btn-magnetic font-label px-5 py-2.5 rounded-pill text-xs transition-all
            ${
              activeFilter === filter.category
              ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20'
              : 'bg-white/60 dark:bg-navy-card/60 text-foreground/70 hover:bg-white dark:hover:bg-navy-card border border-border'
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
