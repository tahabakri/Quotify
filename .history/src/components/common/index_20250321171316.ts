// Components
export { LoadingSpinner } from './LoadingSpinner';
export { ErrorMessage } from './ErrorMessage';
export { NoResults } from './NoResults';

// Types
export type { LoadingSpinnerProps } from './LoadingSpinner';
export type { ErrorMessageProps } from './ErrorMessage';
export type { NoResultsProps } from './NoResults';

// Re-export for convenience
export type CommonComponentProps = {
  className?: string;
};