import { Skeleton } from '../common';

interface QuoteDetailSkeletonProps {
  className?: string;
}

export function QuoteDetailSkeleton({ className = '' }: QuoteDetailSkeletonProps) {
  return (
    <div className={`max-w-4xl mx-auto px-4 py-8 ${className}`}>
      {/* Quote header */}
      <div className="space-y-6 mb-12">
        {/* Quote content */}
        <div className="space-y-3">
          <Skeleton 
            variant="text" 
            className="w-5/6 h-8" 
          />
          <Skeleton 
            variant="text" 
            className="w-full h-8" 
          />
          <Skeleton 
            variant="text" 
            className="w-4/6 h-8" 
          />
        </div>

        {/* Author info */}
        <div className="flex items-center space-x-4">
          <Skeleton 
            variant="circular" 
            width={64} 
            height={64} 
          />
          <div className="space-y-2">
            <Skeleton 
              variant="text" 
              className="w-48" 
            />
            <Skeleton 
              variant="text" 
              className="w-32" 
            />
          </div>
        </div>
      </div>

      {/* Book info and actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Book details */}
        <div className="md:col-span-2 space-y-6">
          <div className="flex space-x-4">
            <Skeleton 
              variant="rectangular" 
              width={120} 
              height={180} 
              className="rounded-lg" 
            />
            <div className="flex-1 space-y-3">
              <Skeleton 
                variant="text" 
                className="w-3/4" 
              />
              <Skeleton 
                variant="text" 
                className="w-1/2" 
              />
              <div className="space-y-1">
                <Skeleton 
                  variant="text" 
                  className="w-full" 
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
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <Skeleton 
            variant="rectangular" 
            height={48} 
            className="rounded-lg w-full" 
          />
          <Skeleton 
            variant="rectangular" 
            height={48} 
            className="rounded-lg w-full" 
          />
          <Skeleton 
            variant="rectangular" 
            height={48} 
            className="rounded-lg w-full" 
          />
        </div>
      </div>

      {/* Image preview */}
      <div className="mt-12">
        <Skeleton 
          variant="rectangular" 
          height={400} 
          className="rounded-lg w-full" 
        />
      </div>
    </div>
  );
}