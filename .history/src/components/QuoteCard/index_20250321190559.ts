export { QuoteCard } from './QuoteCard';
export { QuoteCardSkeleton } from './QuoteCardSkeleton';

export type { QuoteCardProps } from './QuoteCard';
export type { QuoteCardSkeletonProps } from './QuoteCardSkeleton';

// Pre-configured skeletons for different use cases
export function QuoteCardLoadingGrid({ count = 6 }: { count?: number }) {
  return Array.from({ length: count }).map((_, index) => (
    <QuoteCardSkeleton key={`quote-skeleton-${index}`} />
  ));
}