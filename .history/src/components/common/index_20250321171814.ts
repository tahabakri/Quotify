// Components
export { LoadingSpinner } from './LoadingSpinner';
export { ErrorMessage } from './ErrorMessage';
export { NoResults } from './NoResults';
export { Skeleton } from './Skeleton';

// Types
export type { LoadingSpinnerProps } from './LoadingSpinner';
export type { ErrorMessageProps } from './ErrorMessage';
export type { NoResultsProps } from './NoResults';
export type { SkeletonProps } from './Skeleton';

// Re-export common types
export interface CommonComponentProps {
  className?: string;
}

// Custom keyframes for shimmer animation
/** 
 * Add to tailwind.config.js:
 * ```js
 * keyframes: {
 *   shimmer: {
 *     '100%': { transform: 'translateX(100%)' }
 *   }
 * }
 * ```
 */