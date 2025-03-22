import type { BaseProps } from '../../types';

// Components
export { QuoteCard } from './QuoteCard';
export { QuoteCardSkeleton } from './QuoteCardSkeleton';
export { QuoteCardGrid } from './QuoteCardGrid';
export { QuoteCardExample } from './QuoteCardExample';
export { QuoteCardDemo } from './QuoteCardDemo';

// Types
export type { QuoteCardProps } from './QuoteCard';
export type { QuoteCardSkeletonProps } from './QuoteCardSkeleton';
export type { QuoteCardGridProps } from './QuoteCardGrid';
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

// Default values
export const QUOTE_CARD_DEFAULTS = {
  variant: 'default' as const,
  interactive: true,
  theme: {
    backgroundColor: 'transparent',
    textColor: 'currentColor',
    accentColor: 'currentColor',
  },
} as const;

// Utils
export const QUOTE_CARD_VARIANTS = ['default', 'compact', 'featured'] as const;
export type QuoteCardVariant = typeof QUOTE_CARD_VARIANTS[number];

export const createQuoteCardTheme = (
  backgroundColor?: string,
  textColor?: string,
  accentColor?: string
) => ({
  backgroundColor: backgroundColor || QUOTE_CARD_DEFAULTS.theme.backgroundColor,
  textColor: textColor || QUOTE_CARD_DEFAULTS.theme.textColor,
  accentColor: accentColor || QUOTE_CARD_DEFAULTS.theme.accentColor,
});