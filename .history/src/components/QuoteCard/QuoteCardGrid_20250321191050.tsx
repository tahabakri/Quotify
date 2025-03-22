import type { BaseProps } from '../../types';
import { QuoteCardSkeleton } from './QuoteCardSkeleton';

export interface QuoteCardGridProps extends BaseProps {
  count?: number;
}

export function QuoteCardGrid({ 
  count = 6,
  className = ''
}: QuoteCardGridProps) {
  return (
    <div 
      className={`
        grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
        gap-4 md:gap-6
        ${className}
      `}
      role="status"
      aria-label="Loading quotes"
    >
      {Array.from({ length: count }).map((_, index) => (
        <QuoteCardSkeleton 
          key={`quote-skeleton-${index}`} 
          animated={index < 6} // Only animate first 6 to reduce CPU load
        />
      ))}
      <span className="sr-only">Loading {count} quotes...</span>
    </div>
  );
}