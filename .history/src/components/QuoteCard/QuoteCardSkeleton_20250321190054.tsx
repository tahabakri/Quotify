import { Skeleton } from '../common';

interface QuoteCardSkeletonProps {
  className?: string;
}

export function QuoteCardSkeleton({ className = '' }: QuoteCardSkeletonProps) {
  return (
    <div
      className={`
        bg-white dark:bg-gray-800
        rounded-lg shadow-md
        p-6 space-y-4
        ${className}
      `}
    >
      {/* Quote content skeleton */}
      <div className="space-y-2">
        <Skeleton 
          variant="text" 
          className="w-3/4" 
        />
        <Skeleton 
          variant="text" 
          className="w-full" 
        />
        <Skeleton 
          variant="text" 
          className="w-2/3" 
        />
      </div>

      {/* Author and metadata skeleton */}
      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center space-x-3">
          <Skeleton 
            variant="circular" 
            width={40} 
            height={40} 
          />
          <div className="space-y-1">
            <Skeleton 
              variant="text" 
              className="w-24" 
            />
            <Skeleton 
              variant="text" 
              className="w-16" 
            />
          </div>
        </div>

        {/* Action buttons skeleton */}
        <div className="flex space-x-2">
          <Skeleton 
            variant="rectangular" 
            width={32} 
            height={32} 
            className="rounded-lg" 
          />
          <Skeleton 
            variant="rectangular" 
            width={32} 
            height={32} 
            className="rounded-lg" 
          />
        </div>
      </div>
    </div>
  );
}