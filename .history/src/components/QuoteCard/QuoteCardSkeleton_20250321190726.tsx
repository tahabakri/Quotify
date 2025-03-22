import { Skeleton } from '../common';
import type { BaseProps } from '../../types';

export interface QuoteCardSkeletonProps extends BaseProps {
  animated?: boolean;
}

export function QuoteCardSkeleton({ 
  className = '', 
  animated = true 
}: QuoteCardSkeletonProps) {
  const animation = animated ? 'wave' : 'none';

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
          animation={animation}
        />
        <Skeleton 
          variant="text" 
          className="w-full" 
          animation={animation}
        />
        <Skeleton 
          variant="text" 
          className="w-2/3" 
          animation={animation}
        />
      </div>

      {/* Author and metadata skeleton */}
      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center space-x-3">
          <Skeleton 
            variant="circular" 
            width={40} 
            height={40} 
            animation={animation}
          />
          <div className="space-y-1">
            <Skeleton 
              variant="text" 
              className="w-24" 
              animation={animation}
            />
            <Skeleton 
              variant="text" 
              className="w-16" 
              animation={animation}
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
            animation={animation}
          />
          <Skeleton 
            variant="rectangular" 
            width={32} 
            height={32} 
            className="rounded-lg" 
            animation={animation}
          />
          <Skeleton 
            variant="rectangular" 
            width={32} 
            height={32} 
            className="rounded-lg" 
            animation={animation}
          />
        </div>
      </div>
    </div>
  );
}