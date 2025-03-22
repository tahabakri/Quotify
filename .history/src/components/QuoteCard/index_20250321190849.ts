// Components
export { QuoteCard } from './QuoteCard';
export { QuoteCardSkeleton } from './QuoteCardSkeleton';
export { QuoteCardLoadingGrid } from './QuoteCardLoadingGrid';
export { QuoteCardExample } from './QuoteCardExample';

// Types
export type { QuoteCardProps } from './QuoteCard';
export type { QuoteCardSkeletonProps } from './QuoteCardSkeleton';
export type { QuoteCardLoadingGridProps } from './QuoteCardLoadingGrid';
export type { QuoteCardExampleProps } from './QuoteCardExample';

// Helper type for shared card styles
export interface QuoteCardStyles {
  className?: string;
  variant?: 'default' | 'compact' | 'featured';
  interactive?: boolean;
  theme?: {
    backgroundColor?: string;
    textColor?: string;
    accentColor?: string;
  };
}

// Constants
export const QUOTE_CARD_DEFAULT_PROPS = {
  variant: 'default' as const,
  interactive: true,
  theme: {
    backgroundColor: undefined,
    textColor: undefined,
    accentColor: undefined,
  },
};