import { FiAlertCircle } from 'react-icons/fi';

interface ErrorMessageProps {
  message: string;
  className?: string;
  variant?: 'inline' | 'block';
}

export function ErrorMessage({
  message,
  className = '',
  variant = 'block'
}: ErrorMessageProps) {
  if (variant === 'inline') {
    return (
      <span
        role="alert"
        className={`
          inline-flex items-center text-sm text-red-600 dark:text-red-400
          ${className}
        `}
      >
        <FiAlertCircle className="mr-1" aria-hidden="true" />
        {message}
      </span>
    );
  }

  return (
    <div
      role="alert"
      className={`
        rounded-lg bg-red-50 dark:bg-red-900/20 
        border border-red-200 dark:border-red-800 
        p-4
        ${className}
      `}
    >
      <div className="flex items-center">
        <FiAlertCircle 
          className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" 
          aria-hidden="true" 
        />
        <span className="text-red-800 dark:text-red-200">
          {message}
        </span>
      </div>
    </div>
  );
}