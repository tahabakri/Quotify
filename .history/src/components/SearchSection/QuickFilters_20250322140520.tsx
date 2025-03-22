import { useSearch } from '../../contexts/useSearch';
import { cn } from '@/lib/utils';
import { AnimatedButton } from '@/components/ui/motion';
import { motion } from 'framer-motion';
import { staggerChildren, transitions } from '@/lib/animations';

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
    <motion.div
      className={cn("flex gap-2", className)}
      variants={staggerChildren}
      initial="initial"
      animate="animate"
    >
      {filters.map((filter, index) => (
        <motion.div
          key={filter.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transitions.spring, delay: index * 0.1 }}
        >
          <AnimatedButton
            onClick={() => handleFilterSelect(filter.id)}
            variant={activeQuickFilter === filter.id ? "secondary" : "ghost"}
            className="flex-1 min-w-[100px]"
            aria-pressed={activeQuickFilter === filter.id}
          >
            {filter.label}
          </AnimatedButton>
        </motion.div>
      ))}
    </motion.div>
  );
}