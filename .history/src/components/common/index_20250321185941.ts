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

// Re-export common props type
export interface CommonProps {
  className?: string;
}

/**
 * Keyframe animations
 * Add to tailwind.config.js:
 * ```js
 * module.exports = {
 *   theme: {
 *     extend: {
 *       keyframes: {
 *         shimmer: {
 *           '100%': { transform: 'translateX(100%)' }
 *         }
 *       },
 *       animation: {
 *         shimmer: 'shimmer 2s infinite'
 *       }
 *     }
 *   }
 * }
 * ```
 */