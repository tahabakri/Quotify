import { FiTrendingUp, FiClock, FiStar, FiHeart } from 'react-icons/fi';

export type SortOption = 'trending' | 'recent' | 'rating' | 'likes';

interface SortingControlsProps {
  selectedSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const sortOptions: Array<{
  value: SortOption;
  label: string;
  icon: React.ReactNode;
}> = [
  { value: 'trending', label: 'Trending', icon: <FiTrendingUp /> },
  { value: 'recent', label: 'Recent', icon: <FiClock /> },
  { value: 'rating', label: 'Top Rated', icon: <FiStar /> },
  { value: 'likes', label: 'Most Liked', icon: <FiHeart /> },
];

export function SortingControls({ selectedSort, onSortChange }: SortingControlsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {sortOptions.map(({ value, label, icon }) => (
        <button
          key={value}
          onClick={() => onSortChange(value)}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
            transition-colors
            ${
              selectedSort === value
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }
          `}
          aria-pressed={selectedSort === value}
        >
          {icon}
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}