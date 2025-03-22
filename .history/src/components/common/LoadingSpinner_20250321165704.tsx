export interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  label?: string;
  className?: string;
}

export function LoadingSpinner({ 
  size = 'medium', 
  label = 'Loading...', 
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-6 w-6',
    large: 'h-8 w-8'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className={`
          ${sizeClasses[size]}
          border-2
          border-current
          border-r-transparent
          rounded-full
          animate-spin
          text-gray-900
          dark:text-white
        `}
        role="status"
        aria-label={label}
      >
        <span className="sr-only">{label}</span>
      </div>
    </div>
  );
}