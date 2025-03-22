import type { BaseProps } from '../../types';

// Components
export { QuoteCard } from './QuoteCard';
export { QuoteCardSkeleton } from './QuoteCardSkeleton';
export { QuoteCardLoadingGrid } from './QuoteCardLoadingGrid';
export { QuoteCardExample } from './QuoteCardExample';

// Types
export type { QuoteCardProps } from './QuoteCard';
export type { QuoteCardSkeletonProps } from './QuoteCardSkeleton';
export type { QuoteCardExampleProps } from './QuoteCardExample';

// Shared types
export interface QuoteCardStyleProps extends BaseProps {
  variant?: 'default' | 'compact' | 'featured';
  interactive?: boolean;
  theme?: {
    backgroundColor?: string;
    textColor?: string;
    accentColor?: string;
  };
}

// Default prop values
export const QUOTE_CARD_DEFAULTS = {
  variant: 'default' as const,
  interactive: true,
  theme: {
    backgroundColor: 'transparent',
    textColor: 'currentColor',
    accentColor: 'currentColor',
  },
} as const;